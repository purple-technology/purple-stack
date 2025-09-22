import { initTRPC } from '@trpc/server'
import {
	awsLambdaRequestHandler,
	CreateAWSLambdaContextOptions
} from '@trpc/server/adapters/aws-lambda'
import { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from 'aws-lambda'
import { z } from 'zod'

const t = initTRPC
	.context<
		CreateAWSLambdaContextOptions<APIGatewayProxyEvent | APIGatewayProxyEventV2>
	>()
	.create()

//todo: move to proper location
const router = t.router({
	greet: t.procedure
		.input(z.object({ name: z.string() }))
		.query(({ input }) => {
			return `Hello ${input.name}!`
		})
})

export type Router = typeof router

export const handler = awsLambdaRequestHandler({
	router: router,
	createContext: (opts) => opts
})
