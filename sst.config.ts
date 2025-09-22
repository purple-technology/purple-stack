/// <reference path="./.sst/platform/config.d.ts" />

//todo: move me to sst helpers/package
function stageToUrlPart(stage: string): string {
	return stage
		.toLowerCase()
		.split(/[-_\s]+/)
		.map((word, index) =>
			index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
		)
		.join('')
}

export default $config({
	app(input) {
		return {
			name: 'purple-stack',
			removal: input?.stage === 'production' ? 'retain' : 'remove',
			protect: ['master', 'staging'].includes(input?.stage),
			home: 'aws',
			providers: {
				aws: {
					region: 'eu-central-1'
				}
			}
		}
	},
	async run() {
		const storage = await import('./infra/storage')
		await import('./infra/api')

		return {
			MyBucket: storage.bucket.name
		}
	}
})
