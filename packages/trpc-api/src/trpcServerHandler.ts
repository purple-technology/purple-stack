import { productsRouter } from '@purple-stack/trading/api/tradingRouter'
import { initTRPC } from '@trpc/server'
import {
	awsLambdaRequestHandler,
	CreateAWSLambdaContextOptions
} from '@trpc/server/adapters/aws-lambda'
import { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from 'aws-lambda'

export const t = initTRPC
	.context<
		CreateAWSLambdaContextOptions<APIGatewayProxyEvent | APIGatewayProxyEventV2>
	>()
	.create()

export const router = t.router
//todo: introduce private procedure
export const publicProcedure = t.procedure

export type Router = typeof router

export const handler = awsLambdaRequestHandler({
	router: productsRouter,
	createContext: (opts) => opts
})
