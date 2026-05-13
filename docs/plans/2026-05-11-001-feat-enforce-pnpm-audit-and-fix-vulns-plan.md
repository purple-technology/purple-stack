---
title: "feat: Enforce pnpm audit in CI and fix all high/critical vulns"
type: feat
status: completed
created: 2026-05-11
plan_depth: standard
---

# feat: Enforce pnpm audit in CI and fix all high/critical vulns

## Summary

The prior supply-chain hardening commit (`647878a`) added a `pnpm audit --audit-level high` step to the CI workflow but kept `continue-on-error: true` so failures do not block merges. That posture is appropriate for downstream apps that need a grace period before fixing inherited vulns, but **inappropriate for this template repo** — the template should ship clean. This plan:

1. Eliminates every high/critical advisory currently surfaced by `pnpm audit --audit-level high` (9 advisories: 1 critical, 8 high).
2. Flips the audit job to fail the build on any new high/critical finding by removing `continue-on-error`.

The audit currently reports the following high/critical advisories (see Phase 1 research for full table):

| Module | Severity | Recommended fix | Reach |
|---|---|---|---|
| `@trpc/server` | high | ≥11.8.0 | Direct (catalog) |
| `fast-xml-parser` | critical + 3 high | ≥5.5.6 | Transitive via `@aws-sdk/client-sfn` |
| `vite` | high (×2) | ≥7.3.2 | Direct (catalog) + transitive via `vitest` |
| `picomatch` | high | ≥4.0.4 | Transitive via `vite` / chokidar |
| `path-to-regexp` | high | ≥8.4.0 | Transitive via `express` 5.1.0 → `router` |

All recommended versions are >7 days old as of 2026-05-11 and so pass the `minimumReleaseAge: 10080` gate already configured in `pnpm-workspace.yaml`.

## Problem Frame

- **Now:** `security-audit.yaml` runs `pnpm audit --audit-level high` with `continue-on-error: true`. The job reports issues to the logs but never blocks. Today's run lists 1 critical + 10 high advisories.
- **Goal:** The template repo lands with zero high/critical advisories, and any future regression (new advisory at high/critical severity affecting our deps) fails the `security-audit` job, blocking merges.
- **Scope of "fix":** Bump direct dependency versions in the workspace catalog. For transitive deps with no direct upgrade path that picks up the patched version, add a `pnpm.overrides` entry in the root `package.json` (pnpm-workspace.yaml `overrides:` is also supported as of pnpm 9.5+; both work).

## Key Technical Decisions

- **Use `pnpm.overrides` for transitive fixes, not catalog tricks.** `fast-xml-parser`, `picomatch`, `path-to-regexp` are not direct deps. Bumping `@aws-sdk/client-sfn` or `express` to pull patched transitives is brittle: the patched-transitive may not yet be picked up by the newest direct release. Overrides force the resolution, are explicit, and easy to remove later once upstreams catch up. (`see learning:` none yet — captured in `docs/solutions/` as a Compound learning after merge.)
- **Pin override floors to the minimum patched version (`>=X`), not exact versions.** Avoids "override is stale" PR churn while still satisfying the advisory.
- **Bump `@trpc/server` to `11.17.0`** (latest stable, released 2026-04-28, >7 days old). The advisory only requires ≥11.8.0, but bumping to current latest reduces drift for the next maintainer. Both `client` and `server` move together via the catalog.
- **Bump `vite` to `7.3.2`**, not `7.3.3`. `7.3.3` was released 2026-05-07 (4 days old today) and is blocked by `minimumReleaseAge: 10080`. `7.3.2` (2026-04-06) is the highest version that passes the gate. Do **not** jump to vite 8.x — that is a major bump out of scope for a security plan.
- **Remove `continue-on-error: true` from `security-audit.yaml`, do not add an allowlist.** This template has no legacy debt to grandfather. If a brand-new advisory drops and we have no patched version yet, the PR author gets an explicit signal and can decide: wait, override, or document a temporary exception in a follow-up PR. We are not pre-engineering an escape hatch.
- **Keep the audit step's `audit-level` input wired through `workflow_call`.** Apps that consume this template-as-reference may want to lower the bar later; the input stays so they can pass `audit-level: critical` etc. We only change the failure semantics, not the input surface.

## Scope Boundaries

### In scope

- Eliminate all currently reported high/critical `pnpm audit` advisories.
- Make `security-audit.yaml` fail the job on high/critical findings.
- Verify `pnpm install` resolves cleanly with the new versions/overrides.
- Verify the existing `mise lint`, `mise typecheck`, `mise test` pipeline still passes.

### Out of scope

- Moderate/low advisories (currently 17 moderate, 1 low) — `audit-level` remains `high`, by design.
- Migrating to vite 8.x.
- Reworking the audit allowlist/exception mechanism for downstream apps.
- Updating `docs/solutions/` learnings — that is its own follow-up via `ce-compound` after merge.

### Deferred to Follow-Up Work

- Add a `docs/solutions/` learning note describing the override-vs-catalog decision once we've lived with it for a release cycle.
- Consider periodically reviewing whether each override is still required (when AWS SDK ships a release that pulls patched `fast-xml-parser` directly, the override can go away).

---

## System-Wide Impact

- **CI behavior:** `security-audit` job goes from "informational" to "blocking" for high/critical. Any open PR that introduces or inherits a new high/critical advisory will fail until resolved.
- **Lockfile:** `pnpm-lock.yaml` will change substantially — every overridden transitive resolves to its patched line, plus the direct bumps for `@trpc/server` and `vite`.
- **Runtime:** None expected. The vulns being fixed are in code paths we do not use (`experimental_nextAppDirCaller`, vite dev server, fast-xml-parser parsing untrusted XML from inside AWS SDK responses) but the audit treats them as present-and-vulnerable regardless. Bumping is the cheapest, cleanest mitigation.
- **Developer experience:** `pnpm install` after pulling this branch will re-resolve. Anyone running `pnpm audit --audit-level high` locally should get 0 advisories. `mise install` itself unrelated (handled by separate GITHUB token configuration).

---

## Implementation Units

### U1. Bump direct deps in the workspace catalog

**Goal:** Move `@trpc/server`, `@trpc/client`, and `vite` to patched versions through `pnpm-workspace.yaml`'s `catalog:`.

**Requirements:** Eliminates 1 high (`@trpc/server` prototype pollution) + 2 high (`vite` fs.deny bypass, dev-server WS arbitrary read).

**Dependencies:** none.

**Files:**
- `pnpm-workspace.yaml` (catalog entries)
- `pnpm-lock.yaml` (regenerated by `pnpm install`)

**Approach:**
- `@trpc/client`: `11.6.0` → `11.17.0`
- `@trpc/server`: `11.6.0` → `11.17.0` (kept in lockstep with client)
- `vite`: `7.1.9` → `7.3.2` (must use `7.3.2`; `7.3.3` is <7 days old and blocked by `minimumReleaseAge`)
- Run `pnpm install` to regenerate the lockfile.

**Patterns to follow:** The catalog convention is already in use across `packages/*` and `domains/*`; no consumer code needs to change because deps reference `catalog:`.

**Test scenarios:**
- Test expectation: none — pure dependency version bump, behavior covered by existing unit/integration suites.

**Verification:**
- `pnpm install` succeeds without `--no-frozen-lockfile`.
- `pnpm run -r typecheck` passes (catches any tRPC v11.6 → v11.17 type surface drift).
- `pnpm run -r test` passes.
- `pnpm audit --audit-level high` no longer reports `@trpc/server` or `vite` advisories.

---

### U2. Add `pnpm.overrides` for transitive vulns

**Goal:** Force `fast-xml-parser`, `picomatch`, and `path-to-regexp` to their patched lines regardless of which direct dependency pulled them in.

**Requirements:** Eliminates 1 critical + 3 high (`fast-xml-parser`), 1 high (`picomatch`), 1 high (`path-to-regexp`).

**Dependencies:** U1 (so the lockfile change is one coherent regen rather than two).

**Files:**
- `package.json` (root) — add a top-level `pnpm.overrides` block. Both `pnpm.overrides` in root `package.json` and `overrides:` in `pnpm-workspace.yaml` are supported; prefer root `package.json` because it co-locates the override with the dep that requires it and matches the convention most pnpm docs lead with.
- `pnpm-lock.yaml` (regenerated)

**Approach:**

Add to root `package.json`:

```json
"pnpm": {
  "overrides": {
    "fast-xml-parser@<5.5.6": ">=5.5.6",
    "picomatch@<4.0.4": ">=4.0.4",
    "path-to-regexp@<8.4.0": ">=8.4.0"
  }
}
```

> Directional guidance: the scoped-by-vulnerable-range form (`pkg@<X`) tells pnpm "only override when the resolved version would fall below the patched line", which keeps the override inert once upstreams catch up. Plain-key form (`"fast-xml-parser": ">=5.5.6"`) is also acceptable; the implementer can choose based on local pnpm version (`pnpm@10.33.4` supports both).

**Patterns to follow:** No existing override pattern in this repo yet. The supply-chain-hardening skill (`/Users/.../supply-chain-hardening`) describes overrides as the canonical mitigation for transitive vulns.

**Test scenarios:**
- Test expectation: none — pure dep-resolution change.

**Verification:**
- After `pnpm install`, `pnpm list fast-xml-parser picomatch path-to-regexp --depth Infinity` shows only patched versions.
- `pnpm audit --audit-level high` reports **zero** advisories.

---

### U3. Make the `security-audit` job fail on findings

**Goal:** Remove the soft-fail posture so any future high/critical advisory blocks the PR.

**Requirements:** The user-stated goal — "make the job fail in case it founds any new ones".

**Dependencies:** U1, U2 (must merge clean — flipping this before vulns are fixed would block this very PR).

**Files:**
- `.github/workflows/security-audit.yaml`

**Approach:** Delete the `continue-on-error: true` line from the `pnpm audit` step. Keep the `workflow_call` input surface (`audit-level`, default `high`) intact so downstream apps that inherit this workflow can still configure their own severity bar.

Resulting step (directional, not literal):

```yaml
- name: pnpm audit
  run: pnpm audit --audit-level ${{ inputs.audit-level }}
```

**Patterns to follow:** All other jobs in `.github/workflows/test.yaml` already use the default GH Actions "fail-on-nonzero-exit" semantics. This makes the audit step consistent.

**Test scenarios:**
- Test expectation: none — workflow change verified by the PR's own CI run.

**Verification:**
- Push the branch; the `security-audit` job in `test.yaml` runs and **passes** (proving U1+U2 cleared all current findings).
- (Optional sanity, executed locally only) Temporarily revert one override in a throwaway branch and confirm the audit job goes red. Do not commit this.

---

## Risks & Mitigations

- **Risk:** `@trpc/server` 11.6 → 11.17 introduces a type-level breaking change in our router/handler code.
  - **Mitigation:** `pnpm run -r typecheck` is the verification gate at U1. If it fails, the fix may be a router options shape change — read tRPC 11.7–11.17 changelog (already published, links available via GHSA-43p4-m455-4f4j references). Bump in smaller steps (11.6 → 11.8 → 11.17) if a specific minor introduces friction.
- **Risk:** `vite` 7.1 → 7.3 breaks a plugin or config in `web/vite.config.ts` or `domains/transaction`.
  - **Mitigation:** `pnpm run -r build` (manually) and a local `pnpm --filter @purple-stack/web dev` smoke test after U1. The 7.1 → 7.3 jump is a minor and historically smooth; revert and pin to 7.2.x if blocked.
- **Risk:** A `pnpm.overrides` entry interferes with another package's expected version range (e.g., a peer-dep that pinned `picomatch@^3`).
  - **Mitigation:** `pnpm install` will warn loudly. If it does, narrow the override using the scoped form `pkg@source>pkg@version` (pnpm supports nested-path overrides).
- **Risk:** A *new* high/critical advisory drops after merge for a dep with no patched version yet — CI is now red and unblockable.
  - **Mitigation:** This is the explicit accepted tradeoff. The PR author can: (a) downgrade the dep, (b) add a pinned `pnpm.overrides` to a non-vulnerable version, or (c) open a focused PR documenting the exception and temporarily raising `audit-level` to `critical` for the affected window. No pre-built escape hatch — keep the signal honest.
- **Risk:** The `minimumReleaseAge: 10080` policy blocks an override floor we want to set (e.g., a critical advisory with a fix that just shipped today).
  - **Mitigation:** Use the highest version that is ≥7 days old, even if it doesn't yet satisfy the advisory's `patched_versions`. The audit will still flag it, but downgrading the *floor* slightly while keeping the override active reduces exposure. As of today (2026-05-11), all five recommended versions clear this hurdle.

---

## Verification Plan (end-to-end)

A clean run of this plan looks like:

```
pnpm install                               # clean resolve, lockfile updated
pnpm run -r typecheck                      # pass
pnpm run -r test                           # pass
pnpm audit --audit-level high              # "No known vulnerabilities found"
```

Then push and observe:

- `test.yaml > test`: green
- `test.yaml > security-audit`: green (no `continue-on-error` mask)

If any of those four local commands fails, do not push U3 until U1/U2 are reworked.

---

## Origin

No upstream `ce-brainstorm` requirements doc — this plan was authored directly from user request. Source signal: user's `/ce-plan` invocation on branch `plt-658`, immediately after commit `647878a` introduced the soft-fail audit and supply-chain hardening posture.
