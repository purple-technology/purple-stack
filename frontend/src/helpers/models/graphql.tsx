import { GraphQLResult } from '@aws-amplify/api'
import { AWSAppSyncRealTimeProvider } from '@aws-amplify/pubsub'
import { API, graphqlOperation } from 'aws-amplify'
import { DocumentNode } from 'graphql'
import { Observable } from 'zen-observable-ts'

async function fetch<T extends object, V extends object = object>(
	query: DocumentNode,
	variables?: V,
	additionalHeaders?: {
		[key: string]: string
	}
): Promise<GraphQLResult<T>> {
	try {
		const response = await API.graphql(
			graphqlOperation(query, variables),
			additionalHeaders
		)
		if (response instanceof Observable) {
			throw new Error(
				'Used Query/Mutation function for GraphQL Subscription query.'
			)
		}
		return response as GraphQLResult<T>
	} catch (err) {
		return err
	}
}

export interface SubscriptionData<T extends object> {
	provider: AWSAppSyncRealTimeProvider
	value: { data: T }
}

export function subscribe<T extends object>(
	query: DocumentNode,
	variables?: object,
	additionalHeaders?: {
		[key: string]: string
	}
): Observable<SubscriptionData<T>> {
	const response = API.graphql(
		graphqlOperation(query, variables),
		additionalHeaders
	)
	if (!(response instanceof Observable)) {
		throw new Error(
			'Used Subscription function for GraphQL Query/Mutation query.'
		)
	}
	return response as Observable<{
		provider: AWSAppSyncRealTimeProvider
		value: { data: T }
	}>
}

export const query = fetch
export const mutation = fetch
