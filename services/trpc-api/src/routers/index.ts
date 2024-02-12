import { t } from '../trpc'
import { createTodos } from './todos/create'
import { listTodos } from './todos/list'

export const appRouter = t.router({
	todos: t.router({
		create: createTodos,
		list: listTodos
	})
})

// Export only the type of a router!
// This prevents us from importing server code on the client.
export type AppRouter = typeof appRouter
