export interface AppSyncHeaders {
	[name: string]: string
}

export interface AppSyncIdentity {
	claims: {
		sub: string
		event_id: string
		token_use: string
		scope?: string
		auth_time: number
		iss: string
		exp: number
		iat: number
		jti: string
		client_id?: string
		'cognito:username': string
		'cognito:groups'?: string[]
		'cognito:roles'?: string[]
	}
	defaultAuthStrategy?: string
	issuer: string
	sourceIp: string[]
	sub: string
	username: string
}

export interface AppSyncRequest {
	headers: AppSyncHeaders
}

export interface AppSyncInfo {
	fieldName: string
	parentTypeName: string
	variables: {
		[key: string]: string
	}
	selectionSetList: string[]
}

export interface AppSyncEvent<A, S> {
	arguments: A
	source: S
	request: AppSyncRequest
	identity: AppSyncIdentity
	info: AppSyncInfo
}

export type AppSyncBatchEvent<A, S> = AppSyncEvent<A, S>[]

export type AppSyncBatchHandler<A, S, R> = (
	event: AppSyncBatchEvent<A, S>
) => Promise<R[]>

export type AppSyncHandler<A, S, R> = (event: AppSyncEvent<A, S>) => Promise<R>
