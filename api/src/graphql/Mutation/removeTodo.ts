import 'source-map-support/register'

import { getEnvVar } from '@package/env-vars'
import {
	Mutation,
	MutationRemoveTodoArgs,
	Status
} from '@package/graphql-types'
import { AppSyncResolverHandler } from 'aws-lambda'
import AWS from 'aws-sdk'

const dynamoDb = new AWS.DynamoDB()

export const handler: AppSyncResolverHandler<
	MutationRemoveTodoArgs,
	Mutation['removeTodo']
> = async (event): Promise<Mutation['removeTodo']> => {
	try {
		await dynamoDb
			.deleteItem({
				TableName: getEnvVar('DYNAMODB_TABLE_TODOS'),
				Key: {
					createdTimestamp: {
						S: event.arguments.createdTimestamp
					}
				}
			})
			.promise()
		return Status.Success
	} catch (err) {
		console.error(err)
		throw err.message
	}
}
