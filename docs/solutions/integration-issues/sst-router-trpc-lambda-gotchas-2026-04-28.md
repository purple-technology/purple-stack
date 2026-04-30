---
title: "Fronting a tRPC Lambda with sst.aws.Router: path prefix and POST signing gotchas"
date: 2026-04-28
category: integration-issues
module: infra/api
problem_type: integration_issue
component: tooling
symptoms:
  - "tRPC error: No procedure found on path \"api/<procedure>\" (HTTP 404, code NOT_FOUND)"
  - "Lambda POST requests fail with \"The request signature we calculated does not match the signature you provided\" (SigV4 SignatureDoesNotMatch 403)"
  - "Only happens after moving an existing url:true Lambda behind sst.aws.Router; GET-only flows may appear to work"
root_cause: config_error
resolution_type: code_fix
severity: high
tags:
  - sst
  - sst-router
  - trpc
  - lambda-function-url
  - oac
  - sigv4
  - path-rewrite
---

# Fronting a tRPC Lambda with sst.aws.Router: path prefix and POST signing gotchas

## Problem

When putting an existing `sst.aws.Function` (with `url: true`) behind an `sst.aws.Router` — e.g. to attach a WAF WebACL or unify web + API under a single CloudFront — two integration issues surface after deploy that are invisible at typecheck time:

1. POST requests fail with a SigV4 `SignatureDoesNotMatch` 403 when `protection: "oac"` is used on the Router.
2. All tRPC procedure lookups return `NOT_FOUND` because the Router's path prefix (e.g. `/api`) is forwarded verbatim to the Lambda, and tRPC treats the full path as the procedure name.

Both issues only appear on a real deploy — they are silent in `sst deploy --diff` and pass TypeScript checks.

## Symptoms

- Web client calls to the API return a tRPC error:
  ```json
  {
    "error": {
      "message": "No procedure found on path \"api/transaction.deposit\"",
      "code": -32004,
      "data": { "code": "NOT_FOUND", "httpStatus": 404, "path": "api/transaction.deposit" }
    }
  }
  ```
- Before the path-prefix fix, POSTs also returned: `"The request signature we calculated does not match the signature you provided. Check your AWS Secret Access Key and signing method."`
- GET requests through the Router may succeed on their own, masking the POST-signing issue until a mutation is attempted.
- Direct Function URL access (`*.lambda-url.<region>.on.aws`) returns 403 from AWS — this is OAC working as intended and not the bug.

## What Didn't Work

- **Assuming `protection: "oac"` was the right choice.** SST's own docs call it out as "suitable when you control all POST requests" — meaning clients must manually send `x-amz-content-sha256` with the body hash. The tRPC HTTP client does not do this, so every mutation fails SigV4 verification.
- **Assuming the Router's `path: "/api"` argument strips the prefix before forwarding.** It does not. The Router uses the prefix for routing only; the full original path is what reaches the origin (same behavior as any CloudFront path-based behavior mapping).
- **Configuring the tRPC router with an `api` namespace.** tRPC procedure paths are dot-separated, not slash-separated, so `api/transaction.deposit` is not a lookup shape any router configuration can satisfy.

## Solution

Two changes, both small, both required.

### 1. Use `protection: "oac-with-edge-signing"`, not `"oac"`

In `sst.config.ts`:

```ts
const router = new sst.aws.Router('Main', {
  // "oac-with-edge-signing" (not plain "oac") so POST requests work.
  // "oac" alone requires every client to send x-amz-content-sha256 on
  // each POST; edge-signing adds a Lambda@Edge that handles it for us.
  protection: 'oac-with-edge-signing'
})
```

`oac-with-edge-signing` provisions a Lambda@Edge in us-east-1 that signs every request (including the body) before forwarding to the Function URL. Tradeoffs:

- First deploy adds ~2–5 min while Lambda@Edge replicates to edge POPs.
- ~10–50 ms extra latency per request (negligible for internal tooling).
- Teardown (`sst remove`) can lag because CloudFront releases Lambda@Edge functions asynchronously — retry after a wait if you see an "in use" error.

### 2. Strip the Router path prefix inside the Lambda handler

`infra/src/apiHandler.ts`:

```ts
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyEventV2,
  Context
} from 'aws-lambda'
import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda'

const ROUTER_PREFIX = '/api'

const trpcHandler = awsLambdaRequestHandler({
  router: appRouter,
  createContext: (opts) => opts
})

export const handler = async (
  event: APIGatewayProxyEvent | APIGatewayProxyEventV2,
  context: Context
) => {
  const v2 = event as APIGatewayProxyEventV2
  if (v2.rawPath?.startsWith(ROUTER_PREFIX)) {
    v2.rawPath = v2.rawPath.slice(ROUTER_PREFIX.length) || '/'
    if (v2.requestContext?.http?.path) {
      v2.requestContext.http.path = v2.rawPath
    }
  }
  const v1 = event as APIGatewayProxyEvent
  if (v1.path?.startsWith(ROUTER_PREFIX)) {
    v1.path = v1.path.slice(ROUTER_PREFIX.length) || '/'
  }
  return trpcHandler(event, context)
}
```

Keep `ROUTER_PREFIX` in lockstep with the `path` used when attaching the Function to the Router in `infra/api.ts`:

```ts
// infra/api.ts
export function createApi(router: sst.aws.Router) {
  return new sst.aws.Function('tRPCAPI', {
    url: { router: { instance: router, path: '/api' } },
    // ...
  })
}
```

## Why This Works

**POST signing:** AWS Lambda Function URLs with `authType: AWS_IAM` enforce SigV4 verification. The signature covers headers, HTTP method, path, and — critically — the SHA-256 of the request body via the `x-amz-content-sha256` header. Plain `oac` lets CloudFront forward the request with OAC-level signing of headers, but it does not compute the body hash automatically; any POST with a body fails verification. The `oac-with-edge-signing` Lambda@Edge reads the body, computes the hash, adds the correct `x-amz-content-sha256` header, and re-signs the request before it reaches the Function URL.

**Path prefix:** CloudFront path-based cache behaviors use the pattern to decide *which* origin to route to, not what path to forward. The origin receives the original URL path unchanged. tRPC's `awsLambdaRequestHandler` derives the procedure name from `event.rawPath` (V2) or `event.path` (V1) — so `/api/transaction.deposit` becomes a lookup for the literal procedure `api/transaction.deposit`, which does not exist. Stripping the prefix in the handler restores the shape tRPC expects, and keeps the wiring between the Router path and the tRPC router decoupled — the client keeps calling `${router.url}/api/...` and tRPC keeps seeing procedure names without the prefix.

## Prevention

- **Always deploy and exercise a POST path when fronting a Lambda Function URL with `sst.aws.Router`.** Typecheck, `sst diff`, and even a GET smoke test will not catch either of these. Pair the deploy with at least one mutation through the full Router → Function URL path.
- **Default to `protection: "oac-with-edge-signing"`** unless you have a specific reason to require client-side SigV4 hashing (e.g. a small number of backend-to-backend callers you fully control). The cost/latency difference is small; the correctness guarantee is large.
- **Treat the Router path and handler prefix as a shared contract.** If you change `path: '/api'` in the Function's `url.router` config, update `ROUTER_PREFIX` in the handler in the same commit. A comment in each file pointing at the other is enough.
- **Avoid the failure mode when possible by mounting the Lambda at `/`.** If the Router only fronts the API (no Web), use `path: '/'` and skip the handler-side stripping entirely. This repo shares the Router with the Web StaticSite, so `/api` is needed to separate the two surfaces — but that's a deliberate choice, not a default.

## Related Issues

- SST docs on Router `protection` modes: `oac` vs `oac-with-edge-signing` vs `none` — explicitly documents the POST `x-amz-content-sha256` requirement for plain `oac`.
- See also: `docs/plans/2026-04-28-001-feat-sst-router-unify-frontend-api-plan.md` — the plan that introduced the Router in this template, including the `oac-with-edge-signing` choice and the prefix-stripping shim.
