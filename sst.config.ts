/// <reference path="./.sst/platform/config.d.ts" />

//this is prepared for cases where the git stage should be part of the url
//const { stageToUrlPart } = await import('./packages/sst-extensions/src/index')

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
		$transform(sst.aws.Function, (args) => {
			args.runtime = 'nodejs22.x'
		})

		const storage = await import('./infra/storage')
		const api = await import('./infra/api')
		await import('./infra/stepFunction')

		new sst.x.DevCommand('tRPC', {
			link: [api.tRPCAPI],
			dev: {
				autostart: true,
				command: 'pnpm --filter @purple-stack/trpc-api start:panel'
			}
		})

		return {
			MyBucket: storage.bucket.name
		}
	}
})
