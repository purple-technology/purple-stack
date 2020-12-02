import 'source-map-support/register'

import { AppSyncHandler } from '@package/appsync-types'
import { getEnvVar } from '@package/env-vars'
import {
	Mutation,
	MutationRemoveTodoArgs,
	Status
} from '@package/graphql-types'
import AWS from 'aws-sdk'

const dynamoDb = new AWS.DynamoDB()

export const handler: AppSyncHandler<
	MutationRemoveTodoArgs,
	{},
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
