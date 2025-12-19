/// <reference path="./.sst/platform/config.d.ts" />

//this is prepared for cases where the git stage should be part of the url
//const { stageToUrlPart } = await import('./packages/sst-extensions/src/index')

export default $config({
	app(input) {
		return {
			name: 'purple-stack',
			removal: input?.stage === 'master' ? 'retain' : 'remove',
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

		// stacks
		await import('./domains/transaction/features/deposit/stack')
		const api = await import('./infra/api')

		// dev commands visible when running sst dev
		new sst.x.DevCommand('tRPC', {
			link: [api.tRPCAPI],
			dev: {
				autostart: true,
				command: 'pnpm --filter @purple-stack/trpc-api start:panel'
			}
		})

		const web = new sst.aws.StaticSite('Web', {
			build: {
				command: 'pnpm run --filter @purple-stack/web build',
				output: 'web/dist'
			},
			dev: {
				autostart: true,
				command: 'pnpm --filter @purple-stack/web dev',
				directory: 'web'
			},
			environment: {
				VITE_tRPCAPI_url: api.tRPCAPI.url
			}
		})

		return {
			Web: web.url
		}
	}
})
