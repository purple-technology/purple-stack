import express from 'express'

;(async (): Promise<void> => {
	const app = express()

	const { renderTrpcPanel } = await import('trpc-ui')

	// todo: change to parent router
	const { tradingRouter } = await import(
		'@purple-stack/trading/api/tradingRouter'
	)

	app.use('/panel', (_, res) => {
		return res.send(
			renderTrpcPanel(tradingRouter, {
				//todo: dynamically get the url
				url: 'https://3aggmrrp5reidtx3sgtdthvtc40zfzmd.lambda-url.eu-central-1.on.aws',
				meta: {
					title: 'purple-stack tRPC API',
					description: 'Add description here, markdown supported'
				}
			})
		)
	})

	app.listen(3000, () => {
		console.log(`tRPC.ui() available on: http://localhost:3000/panel`)
	})
})()
