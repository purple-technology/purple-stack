import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from './appRouter'

/**
 * TODO: Replace the hardcoded URL with an environment-aware configuration once SST exposes the value.
 */
const API_URL =
	'https://jmtlrmexi24oumt7vn6q5zjnru0meezt.lambda-url.eu-central-1.on.aws'

export type AppRouterInputs = inferRouterInputs<AppRouter>
export type AppRouterOutputs = inferRouterOutputs<AppRouter>

export const appClient = createTRPCProxyClient<AppRouter>({
	links: [httpBatchLink({ url: API_URL })]
})
