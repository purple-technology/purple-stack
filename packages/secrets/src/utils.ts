import { LogError } from '@package/logger'

import mockedConfig from './mocked'
import { Secrets } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSecrets(): { [key: string]: any } {
	if (process.env.NODE_ENV === 'test') {
		return mockedConfig
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return process.env.__SECRETS__ as unknown as { [key: string]: any }
}

export function getEnvVar<T>(
	envName: keyof Secrets,
	condition: (env: T) => boolean
): T {
	const secrets = getSecrets()
	const env = secrets[envName] as unknown as T
	if (typeof env === 'undefined') {
		throw new LogError('secret_env_var_not_found', { envName })
	}
	if (typeof env === 'object' && 'removeMe' in env) {
		throw new LogError('secret_env_var_forbidden_remove_me', { envName, env })
	}
	if (condition(env)) {
		return env
	}
	throw new LogError('secret_env_var_inforrect_schema', { envName, env })
}
