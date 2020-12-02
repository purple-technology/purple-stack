export * from './types'
import { ExampleConfig } from './types'
import { getEnvVar } from './utils'

/*
	BOILERPLATE CODE
	replace with your secrets
*/
export const getExampleConfig = (): ExampleConfig =>
	getEnvVar<ExampleConfig>(
		'SECRET_EXAMPLE',
		(env) =>
			typeof env === 'object' && typeof env.somethingSuperSecret === 'string'
	)
