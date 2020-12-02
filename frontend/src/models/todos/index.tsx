import {
	AddTodoMutation,
	AddTodoMutationVariables,
	FetchTodosQuery,
	RemoveTodoMutation,
	RemoveTodoMutationVariables,
	SwitchCheckMutation,
	SwitchCheckMutationVariables
} from '@package/graphql-types'
import { useState } from 'react'

import { modelify, mutation, query } from '../../helpers/models'
import * as queries from './queries'
import { TodosState } from './types'

export default modelify<TodosState>(() => {
	const [todos, setTodos] = useState<TodosState['todos']>(null)
	const [loadingTodos, setLoadingTodos] = useState<TodosState['loadingTodos']>(
		false
	)

	const fetchTodos: TodosState['fetchTodos'] = async () => {
		if (loadingTodos) return
		try {
			setLoadingTodos(true)
			const { data } = await query<FetchTodosQuery>(queries.fetchTodos)
			if (typeof data !== 'undefined') {
				setTodos(data.todos)
			}
		} finally {
			setLoadingTodos(false)
		}
	}

	const addTodo: TodosState['addTodo'] = async (text) => {
		const { data } = await mutation<AddTodoMutation, AddTodoMutationVariables>(
			queries.addTodo,
			{
				text
			}
		)
		if (typeof data !== 'undefined') {
			await fetchTodos()
			return data.addTodo
		}
		throw new Error('Data is undefined')
	}

	const removeTodo: TodosState['removeTodo'] = async (timestamp) => {
		const { data } = await mutation<
			RemoveTodoMutation,
			RemoveTodoMutationVariables
		>(queries.removeTodo, {
			timestamp
		})
		if (typeof data !== 'undefined') {
			await fetchTodos()
			return data.removeTodo
		}
		throw new Error('Data is undefined')
	}

	const switchCheck: TodosState['switchCheck'] = async (timestamp) => {
		const { data } = await mutation<
			SwitchCheckMutation,
			SwitchCheckMutationVariables
		>(queries.switchCheck, {
			timestamp
		})
		if (typeof data !== 'undefined') {
			await fetchTodos()
			return data.switchCheck
		}
		throw new Error('Data is undefined')
	}

	return {
		todos,
		loadingTodos,
		fetchTodos,
		addTodo,
		removeTodo,
		switchCheck
	}
})
