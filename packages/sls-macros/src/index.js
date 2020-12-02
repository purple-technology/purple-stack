/* eslint-disable @typescript-eslint/explicit-function-return-type */
module.exports = {
	getStorageResourcePolicy(serverless) {
		const { stage } = serverless.service.provider

		if (['master', 'staging'].includes(stage)) {
			return 'Retain'
		}
		return 'Delete'
	},
	isPointInTimeRecoveryEnabled(serverless) {
		const { stage } = serverless.service.provider
		return ['master', 'staging'].includes(stage) ? true : false
	},
	getExternalServiceStage(serverless) {
		const { stage } = serverless.service.provider

		if ('master' === stage) {
			return 'master'
		}

		return 'staging'
	},
	getSecretsStage(serverless) {
		const { stage } = serverless.service.provider

		if ('master' === stage) {
			return 'master'
		}

		return 'staging'
	}
}
