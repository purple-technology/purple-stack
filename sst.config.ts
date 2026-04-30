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

		const router = new sst.aws.Router('Main', {
			// "oac-with-edge-signing" (not plain "oac") so POST requests work.
			// "oac" alone requires every client to send x-amz-content-sha256 on
			// each POST; edge-signing adds a Lambda@Edge that handles it for us.
			protection: 'oac-with-edge-signing'
		})

		// stacks
		await import('./domains/transaction/features/deposit/stack')
		const { createApi } = await import('./infra/api')
		const tRPCAPI = createApi(router)

		// dev commands visible when running sst dev
		new sst.x.DevCommand('tRPC', {
			link: [tRPCAPI, router],
			dev: {
				autostart: true,
				command: 'pnpm --filter @purple-stack/trpc-api start:panel'
			}
		})

		new sst.aws.StaticSite('Web', {
			router: { instance: router },
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
				VITE_tRPCAPI_url: $interpolate`${router.url}/api`
			}
		})

		return {
			Url: router.url
		}
	}
})
