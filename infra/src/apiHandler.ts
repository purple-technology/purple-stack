import { transactionRouter } from '@purple-stack/transaction/api/transactionRouter'
import { createAppRouter } from '@purple-stack/trpc-api/appRouter'
import {
	awsLambdaRequestHandler,
	type CreateAWSLambdaContextOptions
} from '@trpc/server/adapters/aws-lambda'
import type {
	APIGatewayProxyEvent,
	APIGatewayProxyEventV2,
	Context
} from 'aws-lambda'

type LambdaContextOptions = CreateAWSLambdaContextOptions<
	APIGatewayProxyEvent | APIGatewayProxyEventV2
>

/**
 * Application-level router composition.
 * This is where all domain routers are brought together.
 * Add new domain routers here as you create them.
 */
export const appRouter = createAppRouter({
	transaction: transactionRouter
})

export type AppRouter = typeof appRouter

// Shared contract with `infra/api.ts`'s `url.router.path: '/api'`.
const ROUTER_PREFIX = '/api'

const trpcHandler = awsLambdaRequestHandler({
	router: appRouter,
	createContext: (opts: LambdaContextOptions) => opts
})

/**
 * Lambda handler for tRPC API.
 *
 * The SST Router attaches this Lambda at `/api/*` and forwards the full path
 * (including the `/api` prefix) to the Function URL. tRPC uses the path as
 * the procedure name, so the prefix must be stripped here before delegating.
 */
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
