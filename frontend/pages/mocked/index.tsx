import { Status } from '@package/graphql-types'
import Head from 'next/head'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import TodosModel from '../../src/models/todos'
import { TodosState } from '../../src/models/todos/types'
import TodosList from '../../src/scenes/TodosList'

const Mocked: React.FC = () => {
	const { t } = useTranslation()

	const [todos, setTodos] = useState<TodosState['todos']>(null)

	const data: TodosState = {
		todos: todos,
		loadingTodos: false,
		fetchTodos: async () => {
			setTodos([
				{
					checked: false,
					createdTimestamp: `${Date.now()}`,
					text: 'karel'
				}
			])
		},
		addTodo: async (text) => {
			setTodos([
				...(todos ?? []),
				{
					checked: false,
					createdTimestamp: `${Date.now()}`,
					text: text
				}
			])
			return Status.Success
		},
		removeTodo: async (timestamp) => {
			setTodos(
				(todos ?? []).filter(
					({ createdTimestamp }) => createdTimestamp !== timestamp
				)
			)
			return Status.Success
		},
		switchCheck: async (timestamp) => {
			setTodos(
				(todos ?? []).map((todo) =>
					todo.createdTimestamp === timestamp
						? {
								...todo,
								checked: !todo.checked
						  }
						: todo
				)
			)
			return Status.Success
		}
	}

	return (
		<React.Fragment>
			<Head>
				<title>{t('main.title')}</title>
			</Head>
			<TodosModel.Provider value={data}>
				<TodosList />
			</TodosModel.Provider>
		</React.Fragment>
	)
}

export default Mocked
