import type { tradingRouter } from '@purple-stack/trading/api/tradingRouter'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

/**
 * TODO: Replace the hardcoded URL with an environment-aware configuration once SST exposes the value.
 */
const API_URL =
	'https://jmtlrmexi24oumt7vn6q5zjnru0meezt.lambda-url.eu-central-1.on.aws'

export type TradingRouter = typeof tradingRouter
export type TradingRouterInputs = inferRouterInputs<TradingRouter>
export type TradingRouterOutputs = inferRouterOutputs<TradingRouter>

export const tradingClient = createTRPCProxyClient<TradingRouter>({
	links: [httpBatchLink({ url: API_URL })]
})
