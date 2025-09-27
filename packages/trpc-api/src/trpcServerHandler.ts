import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda'
import { appRouter } from './appRouter'

export const handler = awsLambdaRequestHandler({
	router: appRouter,
	createContext: (opts) => opts
})
