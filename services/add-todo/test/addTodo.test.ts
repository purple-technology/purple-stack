import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { handler as addTodo } from '../src/addTodo'

const ddbMock = mockClient(DynamoDBClient)

vi.mock('sst/node/table', () => ({
	Table: {
		TodosTable: {
			tableName: ''
		}
	}
}))

vi.mock('@packages/timestamp', () => ({
	getTimestamp: (): string => '2024-01-01 00:00:00.000'
}))

describe('addTodo', () => {
	beforeEach(() => {
		ddbMock.reset()
		vi.resetAllMocks()
	})

	it('should succeed', async () => {
		ddbMock.on(PutItemCommand).resolves({})

		expect(
			await addTodo({
				text: 'karel'
			})
		).toEqual({
			success: true
		})
	})

	it('should fail when invalid input', async () => {
		ddbMock.on(PutItemCommand).resolves({})

		expect(addTodo({})).rejects.toThrow()
	})
})
