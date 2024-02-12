import { Certificate } from 'aws-cdk-lib/aws-certificatemanager'
import { ResponseHeadersPolicy } from 'aws-cdk-lib/aws-cloudfront'
import type { ApiGatewayV1Api, StackContext } from 'sst/constructs'
import { NextjsSite, use } from 'sst/constructs'

// @ts-expect-error JS file
import { getContentSecurityPolicy } from '../../services/frontend/next.config'
import { TrpcApiStack } from '../trpc-api/stack'
import { appDomain, appUrl, isProd } from '../utils'

export function FrontendStack({ stack, app }: StackContext): void {
	const trpcApi = use(TrpcApiStack)

	const restApiDomain = (api: ApiGatewayV1Api): string =>
		`${api.cdk.restApi.restApiId}.execute-api.${stack.region}.${stack.urlSuffix}`

	const responseHeadersPolicy = new ResponseHeadersPolicy(
		stack,
		'ResponseHeaders',
		{
			/* In case you use report-uri
			   Example:
				*/
			// customHeadersBehavior: {
			// 	customHeaders: [
			// 		{
			// 			header: 'Report-To',
			// 			value:
			// 				'{"group":"default","max_age":31536000,"endpoints":[{"url":"https://myaxiory.report-uri.com/a/d/g"}],"include_subdomains":true}',
			// 			override: true
			// 		}
			// 	]
			// },
			securityHeadersBehavior: {
				contentSecurityPolicy: {
					/* In case you want to use Cognito */
					// cognito-idp.${self.provider.region}.amazonaws.com

					// Add your own dependencies here.

					// You might wanna add your own report-uri
					// Example: "report-uri https://myaxiory.report-uri.com/r/d/csp/enforce;"
					contentSecurityPolicy: getContentSecurityPolicy(
						restApiDomain(trpcApi.restApi)
					),
					override: true
				}
			}
		}
	)

	new NextjsSite(stack, 'Next', {
		path: 'services/frontend',
		environment: {
			NEXT_PUBLIC_TRPC_API_URL: trpcApi.restApi.url
			/* In case you want to use Cognito */
			// NEXT_PUBLIC_USER_POOL_ID: resources.userPool.userPoolId,
			// NEXT_PUBLIC_USER_POOL_CLIENT_ID: resources.userPool.userPoolId
		},
		cdk: {
			responseHeadersPolicy: responseHeadersPolicy
		},
		customDomain: {
			domainName: appDomain(app),
			hostedZone: isProd(app)
				? 'purple-technology.io' // CHANGE_ME
				: 'staging.purple-technology.io', // CHANGE_ME
			cdk: {
				certificate: Certificate.fromCertificateArn(
					stack,
					'certificate',
					isProd(app) ? 'CHANGE_ME' : 'CHANGE_ME'
				)
			}
		}
	})

	stack.addOutputs({
		FrontendUrl: appUrl(app)
	})
}
