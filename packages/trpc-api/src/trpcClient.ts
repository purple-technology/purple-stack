import type { transactionRouter } from 'domains/transaction/api/transactionRouter'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

/**
 * TODO: Replace the hardcoded URL with an environment-aware configuration once SST exposes the value.
 */
const API_URL =
	'https://jmtlrmexi24oumt7vn6q5zjnru0meezt.lambda-url.eu-central-1.on.aws'

export type TransactionRouter = typeof transactionRouter
export type TransactionRouterInputs = inferRouterInputs<TransactionRouter>
export type TransactionRouterOutputs = inferRouterOutputs<TransactionRouter>

export const transactionClient = createTRPCProxyClient<TransactionRouter>({
	links: [httpBatchLink({ url: API_URL })]
})
