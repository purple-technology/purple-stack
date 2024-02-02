import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { getTimestamp } from '@packages/timestamp'
import { Table } from 'sst/node/table'

import type { Output } from '../types'
import { schema } from '../types'

const client = new DynamoDBClient({})

export const handler = async (_input: unknown): Promise<Output> => {
	const x = schema.safeParse(_input)

	if (!x.success) {
		throw new Error('Invalid input')
	}

	const input = x.data

	await client.send(
		new PutItemCommand({
			TableName: Table.TodosTable.tableName,
			Item: {
				createdTimestamp: {
					S: getTimestamp()
				},
				text: {
					S: input.text
				},
				checked: {
					BOOL: false
				}
			}
		})
	)

	return {
		success: true
	}
}
