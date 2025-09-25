import { transactionRouter } from 'domains/transaction/api/transactionRouter'
import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda'

export const handler = awsLambdaRequestHandler({
	router: transactionRouter,
	createContext: (opts) => opts
})
