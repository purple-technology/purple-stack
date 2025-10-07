import express from 'express'

;(async (): Promise<void> => {
	const app = express()

	const { renderTrpcPanel } = await import('trpc-ui')

	const { appRouter } = await import('../../../infra/apiHandler')

	app.use('/panel', (_, res) => {
		const trpcApiResource = process.env.SST_RESOURCE_tRPCAPI
		if (!trpcApiResource) {
			throw new Error('SST_RESOURCE_tRPCAPI environment variable is missing')
		}

		const parsedResource = JSON.parse(trpcApiResource)
		const url = parsedResource.url
		if (!url) {
			throw new Error('URL not found in SST_RESOURCE_tRPCAPI resource')
		}

		return res.send(
			renderTrpcPanel(appRouter, {
				url,
				meta: {
					title: 'purple-stack tRPC API',
					description: 'API URL: ' + url
				}
			})
		)
	})

	app.listen(3000, () => {
		console.log(`tRPC.ui() available on: http://localhost:3000/panel`)
	})
})()
