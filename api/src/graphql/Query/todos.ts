import 'source-map-support/register'

import { getEnvVar } from '@package/env-vars'
import { Query, Todo } from '@package/graphql-types'
import { AppSyncBatchResolverHandler } from 'aws-lambda'
import AWS from 'aws-sdk'

export const handler: AppSyncBatchResolverHandler<{}, Query['todos']> = async (
	event
): Promise<Query['todos'][]> => {
	const dynamoDb = new AWS.DynamoDB.DocumentClient()

	const getAllTodos = async (
		lastEvaluatedKey?: AWS.DynamoDB.Key
	): Promise<Todo[]> => {
		const params: AWS.DynamoDB.ScanInput = {
			TableName: getEnvVar('DYNAMODB_TABLE_TODOS')
		}
		if (lastEvaluatedKey) {
			params.ExclusiveStartKey = lastEvaluatedKey
		}
		const results = await dynamoDb.scan(params).promise()
		return [
			...(results.Items ? results.Items : []),
			...(results.LastEvaluatedKey
				? await getAllTodos(results.LastEvaluatedKey)
				: [])
		] as Todo[]
	}

	try {
		return await Promise.all(event.map(async () => await getAllTodos()))
	} catch (err) {
		console.error(err)
		throw err.message
	}
}
