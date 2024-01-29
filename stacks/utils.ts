import { RemovalPolicy } from 'aws-cdk-lib'
import type { TableProps } from 'aws-cdk-lib/aws-dynamodb'
import type { QueueProps } from 'aws-cdk-lib/aws-sqs'
import type { App } from 'sst/constructs'

export const isProd = (app: App): boolean => app.stage === 'master'

export const isStaging = (app: App): boolean => app.stage === 'staging'

export const appDomain = (app: App): string =>
	isProd(app)
		? 'www.purple-technology.com'
		: app.local
			? 'localhost:3000'
			: `${app.stage.toLowerCase()}-app-ksnxaq.staging.purple-technology.com`

export const appUrl = (app: App): string =>
	`${app.local ? 'http' : 'https'}://${appDomain(app)}`

export const getRemovalPolicy = (app: App): RemovalPolicy =>
	isProd(app) ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY

export const tableRemovalPolicy = (
	app: App
): Pick<TableProps, 'deletionProtection' | 'removalPolicy'> => ({
	deletionProtection: isProd(app),
	removalPolicy: isProd(app) ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY
})

export const queueRemovalPolicy = (
	app: App
): Pick<QueueProps, 'removalPolicy'> => ({
	removalPolicy: isProd(app) ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY
})
