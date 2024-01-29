import { getStage } from '@purple/serverless-git-branch-stage-plugin'
import type { SSTConfig } from 'sst'

import { ResourcesStack } from './stacks/resources/stack'
import { isProd, isStaging } from './stacks/utils'

const config: SSTConfig = {
	config(globals) {
		const stage = globals.stage ?? getStage()

		return {
			name: 'purple-stack',
			stage,
			region: stage === 'master' ? 'eu-central-1' : 'eu-central-1'
		}
	},
	stacks(app) {
		if (app.stage === 'master' && app.mode === 'dev') {
			throw new Error('Cannot deploy master stage in dev mode')
		}

		app.setDefaultFunctionProps({
			runtime: 'nodejs20.x',
			architecture: 'arm_64',
			logRetention: 'three_months',
			logRetentionRetryOptions: { maxRetries: 100 },
			tracing: 'disabled',
			environment: {
				// https://docs.powertools.aws.dev/lambda/typescript/latest/#environment-variables
				POWERTOOLS_DEV: app.local ? 'true' : 'false',
				POWERTOOLS_LOG_LEVEL: app.local
					? 'DEBUG'
					: isProd(app) || isStaging(app)
						? 'WARN'
						: 'INFO'
			}
		})

		app.stack(ResourcesStack)
	}
}

export default config
