import { initTRPC } from '@trpc/server'
import { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda'
import { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from 'aws-lambda'

export const t = initTRPC
	.context<
		CreateAWSLambdaContextOptions<APIGatewayProxyEvent | APIGatewayProxyEventV2>
	>()
	.create()

export const router = t.router
export const publicProcedure = t.procedure

export type Router = typeof router
