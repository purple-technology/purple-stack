import { productsRouter } from '@purple-stack/trading/api/tradingRouter'
import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda'

export const handler = awsLambdaRequestHandler({
	router: productsRouter,
	createContext: (opts) => opts
})