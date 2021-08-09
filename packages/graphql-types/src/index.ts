export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
	[K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
	{ [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
	{ [SubKey in K]: Maybe<T[SubKey]> }
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
	switchCheck: Status
	removeTodo: Status
}

export type MutationAddTodoArgs = {
	text: Scalars['String']
}

export type MutationSwitchCheckArgs = {
	createdTimestamp: Scalars['ID']
}

export type MutationRemoveTodoArgs = {
	createdTimestamp: Scalars['ID']
}

export type Query = {
	__typename?: 'Query'
	todos: Array<Todo>
}

export enum Status {
	Success = 'SUCCESS',
	Fail = 'FAIL'
}

export type Todo = {
	__typename?: 'Todo'
	text: Scalars['String']
	createdTimestamp: Scalars['ID']
	checked: Scalars['Boolean']
}

export type FetchTodosQueryVariables = Exact<{ [key: string]: never }>

export type FetchTodosQuery = { __typename?: 'Query' } & {
	todos: Array<
		{ __typename?: 'Todo' } & Pick<
			Todo,
			'text' | 'createdTimestamp' | 'checked'
		>
	>
}

export type AddTodoMutationVariables = Exact<{
	text: Scalars['String']
}>

export type AddTodoMutation = { __typename?: 'Mutation' } & Pick<
	Mutation,
	'addTodo'
>

export type RemoveTodoMutationVariables = Exact<{
	timestamp: Scalars['ID']
}>

export type RemoveTodoMutation = { __typename?: 'Mutation' } & Pick<
	Mutation,
	'removeTodo'
>

export type SwitchCheckMutationVariables = Exact<{
	timestamp: Scalars['ID']
}>

export type SwitchCheckMutation = { __typename?: 'Mutation' } & Pick<
	Mutation,
	'switchCheck'
>
