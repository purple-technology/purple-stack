import { Status, Todo } from '@package/graphql-types'

export interface TodosState {
	todos: Omit<Todo, '__typename'>[] | null
	loadingTodos: boolean
	fetchTodos: () => Promise<void>
	addTodo: (text: string) => Promise<Status>
	removeTodo: (timestamp: string) => Promise<Status>
	switchCheck: (timestamp: string) => Promise<Status>
}
