/// <reference types="next" />
/// <reference types="next/types/global" />

declare module '*.gql' {
	import { DocumentNode } from 'graphql'
	const Schema: DocumentNode

	export = Schema
}

declare namespace NodeJS {
	export interface ProcessEnv {
		[key: string]: string
	}
}
