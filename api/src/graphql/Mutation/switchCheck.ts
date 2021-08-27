import 'source-map-support/register'

import { stringifyError } from '@package/api-utils'
import { getEnvVar } from '@package/env-vars'
import {
	Mutation,
	MutationSwitchCheckArgs,
	Status
} from '@package/graphql-types'
import { AppSyncResolverHandler } from 'aws-lambda'
import AWS from 'aws-sdk'

const dynamoDb = new AWS.DynamoDB()

export const handler: AppSyncResolverHandler<
	MutationSwitchCheckArgs,
	Mutation['switchCheck']
> = async (event): Promise<Mutation['switchCheck']> => {
	try {
		const { Item } = await dynamoDb
			.getItem({
				TableName: getEnvVar('DYNAMODB_TABLE_TODOS'),
				Key: {
					createdTimestamp: {
						S: event.arguments.createdTimestamp
					}
				},
				ProjectionExpression: 'createdTimestamp, checked'
			})
			.promise()

		await dynamoDb
			.updateItem({
				TableName: getEnvVar('DYNAMODB_TABLE_TODOS'),
				Key: {
					createdTimestamp: {
						S: event.arguments.createdTimestamp
					}
				},
				ExpressionAttributeNames: {
					'#c': 'checked'
				},
				ExpressionAttributeValues: {
					':c': {
						BOOL: !Item?.checked.BOOL
					}
				},
				UpdateExpression: 'SET #c = :c'
			})
			.promise()
		return Status.Success
	} catch (err) {
		console.error(err)
		throw stringifyError(err)
	}
}
