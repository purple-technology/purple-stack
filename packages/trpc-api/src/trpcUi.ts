import express from 'express'

;(async (): Promise<void> => {
	const app = express()

	const { renderTrpcPanel } = await import('trpc-ui')

	const { appRouter } = await import('../../../infra/src/apiHandler')

	app.use('/panel', (_, res) => {
		const routerResource = process.env.SST_RESOURCE_Main
		if (!routerResource) {
			throw new Error('SST_RESOURCE_Main environment variable is missing')
		}

		const parsedResource = JSON.parse(routerResource)
		const routerUrl = parsedResource.url
		if (!routerUrl) {
			throw new Error('URL not found in SST_RESOURCE_Main resource')
		}

		const url = `${routerUrl}/api`

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
