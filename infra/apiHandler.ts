import { transactionRouter } from '@purple-stack/transaction/api/transactionRouter'
import { createAppRouter } from '@purple-stack/trpc-api/appRouter'
import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda'

/**
 * Application-level router composition.
 * This is where all domain routers are brought together.
 * Add new domain routers here as you create them.
 */
export const appRouter = createAppRouter({
	transaction: transactionRouter
})

export type AppRouter = typeof appRouter

/**
 * Lambda handler for tRPC API
 */
export const handler = awsLambdaRequestHandler({
	router: appRouter,
	createContext: (opts: any) => opts
})
