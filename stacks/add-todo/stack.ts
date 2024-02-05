import type { IStateMachine } from 'aws-cdk-lib/aws-stepfunctions'
import type { StackContext } from 'sst/constructs'
import { use } from 'sst/constructs'

import { ResourcesStack } from '../resources/stack'
import { AddTodoStateMachine } from './AddTodoStateMachine'

interface AddTodoStackOutput {
	addTodoStateMachine: IStateMachine
}

export function AddTodoStack({ stack }: StackContext): AddTodoStackOutput {
	const { todosTable } = use(ResourcesStack)

	stack.setDefaultFunctionProps({
		bind: [todosTable]
	})

	const addTodoStateMachine = new AddTodoStateMachine(
		stack,
		'AddTodoStateMachine',
		{
			servicePath: 'services/add-todo/src'
		}
	)

	return {
		addTodoStateMachine: addTodoStateMachine.stateMachine
	}
}
