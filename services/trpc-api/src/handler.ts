import { Logger } from '@aws-lambda-powertools/logger'
import type { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda'
import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda'
import type {
	APIGatewayProxyWithCognitoAuthorizerEvent,
	APIGatewayProxyWithCognitoAuthorizerHandler
} from 'aws-lambda'

import { appRouter } from './routers'
import type { Context } from './trpc'

const createContext = (
	{
		// event
	}: CreateAWSLambdaContextOptions<APIGatewayProxyWithCognitoAuthorizerEvent>
): Context => {
	return {
		/* In case you want to use Cognito */
		// userCognitoId: event.requestContext.authorizer.claims['sub'] as string
		userCognitoId: 'karel123'
	}
}

const logger = new Logger({ serviceName: 'trpc-api' })

export const handler: APIGatewayProxyWithCognitoAuthorizerHandler = (
	event,
	context
) =>
	awsLambdaRequestHandler({
		router: appRouter,
		responseMeta: () => ({
			headers: {
				'Access-Control-Allow-Origin': `${
					(process.env['ALLOW_ORIGINS'] ?? '')
						.split(';')
						.includes(event.headers['origin'] ?? 'none')
						? event.headers['origin']
						: process.env['APP_URL']
				}`
			}
		}),
		onError({ error }) {
			logger.error('tRPC Error', error)
		},
		createContext
	})(event, context)
