import { LogError } from '@package/logger'

/**
 * Do not use this fucntion on Frontend.
 * It won't work there because environment variables are there
 * passed via Webpack's DefinePlugin.
 */
export const getEnvVar = (name: string): string => {
	const variable = process.env[name]

	const isTest = process.env.NODE_ENV === 'test'

	if (!isTest && typeof variable === 'undefined') {
		throw new LogError('process_env_var_undefined', {
			name
		})
	}

	return variable ?? ''
}
