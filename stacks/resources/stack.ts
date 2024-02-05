import type { StackContext } from 'sst/constructs'
import { Table } from 'sst/constructs'

import { tableRemovalPolicy } from '../utils'

interface ResourcesStackOutput {
	todosTable: Table
}

export function ResourcesStack({
	stack,
	app
}: StackContext): ResourcesStackOutput {
	const todosTable = new Table(stack, 'TodosTable', {
		fields: {
			createdTimestamp: 'string'
		},
		primaryIndex: {
			partitionKey: 'createdTimestamp'
		},
		cdk: {
			table: {
				...tableRemovalPolicy(app)
			}
		}
	})

	return {
		todosTable
	}
}
