import { bucket } from './storage'

//todo: rename and move this
export const myApi = new sst.aws.Function('MyApi', {
	url: true,
	link: [bucket],
	//todo: create new wrapper to specify runtime defaults and reuse it
	runtime: 'nodejs22.x',
	handler: 'packages/trpc-api/src/trpcServerHandler.handler'
})
