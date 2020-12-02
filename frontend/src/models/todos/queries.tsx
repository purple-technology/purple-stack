import gql from 'graphql-tag'

export const fetchTodos = gql`
	query FetchTodos {
		todos {
			text
			createdTimestamp
			checked
		}
	}
`

export const addTodo = gql`
	mutation AddTodo($text: String!) {
		addTodo(text: $text)
	}
`
export const removeTodo = gql`
	mutation RemoveTodo($timestamp: ID!) {
		removeTodo(createdTimestamp: $timestamp)
	}
`

export const switchCheck = gql`
	mutation SwitchCheck($timestamp: ID!) {
		switchCheck(createdTimestamp: $timestamp)
	}
`
