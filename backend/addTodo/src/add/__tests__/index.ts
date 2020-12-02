import AWS from 'aws-sdk'
import AWSMock from 'aws-sdk-mock'
import { cloneDeep } from 'lodash'

import * as input from '../__io__/add.json'
import { handler } from '../index'
import { Input } from '../types'

const env = { ...process.env }

afterEach(() => {
	process.env = { ...env }
})

describe('#addTodo', () => {
	it('should add todo', async () => {
		process.env.DYNAMODB_TABLE_TODOS = 'table_name'

		AWSMock.setSDKInstance(AWS)
		AWSMock.mock(
			'DynamoDB',
			'putItem',
			(_: object, callback: (x: null, y: object) => void) => callback(null, {})
		)

		await handler(cloneDeep(input) as Input)

		AWSMock.restore('DynamoDB')
	})

	it('should fail', async () => {
		const i = { ...cloneDeep(input), text: 123 } as unknown
		let error: Error = new Error()
		try {
			await handler(i as Input)
		} catch (err) {
			error = err
		}
		expect(error.message).toEqual('"text" must be a string')
	})
})
