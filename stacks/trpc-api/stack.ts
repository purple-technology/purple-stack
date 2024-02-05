import { Cors } from 'aws-cdk-lib/aws-apigateway'
import type { StackContext } from 'sst/constructs'
import { ApiGatewayV1Api } from 'sst/constructs'

import { appUrl, isProd } from '../utils'

interface TrpcApiStackOutput {
	restApi: ApiGatewayV1Api<{
		/* In case you want to use Cognito */
		// AppCognitoAuth: {
		// 	type: 'user_pools'
		// 	userPoolIds: string[]
		// 	identitySource: string
		// }
	}>
}

export function TrpcApiStack({ stack, app }: StackContext): TrpcApiStackOutput {
	const allowOrigins = [
		appUrl(app),
		...(isProd(app) ? [] : ['http://localhost:3000'])
	]

	const api = new ApiGatewayV1Api(stack, 'TrpcApi', {
		cdk: {
			restApi: {
				defaultCorsPreflightOptions: {
					allowOrigins,
					allowMethods: Cors.ALL_METHODS,
					allowCredentials: true
				}
			}
		},
		/* In case you want to use Cognito */
		// authorizers: {
		// 	AppCognitoAuth: {
		// 		type: 'user_pools',
		// 		userPoolIds: [resources.userPool.userPoolId],
		// 		identitySource: 'method.request.header.Authorization'
		// 	}
		// },
		routes: {
			'ANY /trpc/{proxy+}': {
				/* In case you want to use Cognito */
				// authorizer: 'App CognitoAuth',
				function: {
					handler: './services/trpc-api/src/handler.handler',
					environment: {
						APP_URL: appUrl(app),
						ALLOW_ORIGINS: allowOrigins.join(';')
					}
				}
			}
		}
	})

	stack.addOutputs({
		apiUrl: api.url
	})

	return {
		restApi: api
	}
}
