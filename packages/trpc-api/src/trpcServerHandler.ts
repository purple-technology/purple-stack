import { tradingRouter } from '@purple-stack/trading/api/tradingRouter'
import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda'

export const handler = awsLambdaRequestHandler({
	router: tradingRouter,
	createContext: (opts) => opts
})
