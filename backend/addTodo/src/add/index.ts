import 'source-map-support/register'

import { getEnvVar } from '@package/env-vars'
import AWS from 'aws-sdk'
import moment from 'moment'

import { Input, Output, validateSchema } from './types'

export const handler = async (input: Input): Promise<Output> => {
	const dynamoDb = new AWS.DynamoDB()

	try {
		validateSchema(input)

		await dynamoDb
			.putItem({
				TableName: getEnvVar('DYNAMODB_TABLE_TODOS'),
				Item: {
					createdTimestamp: {
						S: moment().format('YYYY-MM-DD HH:mm:ss.SSS')
					},
					text: {
						S: input.text
					},
					checked: {
						BOOL: false
					}
				}
			})
			.promise()
	} catch (err) {
		console.error(err)
		throw err
	}
}
