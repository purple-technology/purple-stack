export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
	[K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]: Maybe<T[SubKey]>
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: string
	String: string
	Boolean: boolean
	Int: number
	Float: number
}

export type Mutation = {
	__typename?: 'Mutation'
	addTodo: Status
	removeTodo: Status
	switchCheck: Status
}

export type MutationAddTodoArgs = {
	text: Scalars['String']
}

export type MutationRemoveTodoArgs = {
	createdTimestamp: Scalars['ID']
}

export type MutationSwitchCheckArgs = {
	createdTimestamp: Scalars['ID']
}

export type Query = {
	__typename?: 'Query'
	todos: Array<Todo>
}

export enum Status {
	Fail = 'FAIL',
	Success = 'SUCCESS'
}

export type Todo = {
	__typename?: 'Todo'
	checked: Scalars['Boolean']
	createdTimestamp: Scalars['ID']
	text: Scalars['String']
}

export type FetchTodosQueryVariables = Exact<{ [key: string]: never }>

export type FetchTodosQuery = {
	__typename?: 'Query'
	todos: Array<{
		__typename?: 'Todo'
		text: string
		createdTimestamp: string
		checked: boolean
	}>
}

export type AddTodoMutationVariables = Exact<{
	text: Scalars['String']
}>

export type AddTodoMutation = { __typename?: 'Mutation'; addTodo: Status }

export type RemoveTodoMutationVariables = Exact<{
	timestamp: Scalars['ID']
}>

export type RemoveTodoMutation = { __typename?: 'Mutation'; removeTodo: Status }

export type SwitchCheckMutationVariables = Exact<{
	timestamp: Scalars['ID']
}>

export type SwitchCheckMutation = {
	__typename?: 'Mutation'
	switchCheck: Status
}
