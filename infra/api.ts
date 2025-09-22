import { bucket } from './storage'

//todo: rename and move this
export const myApi = new sst.aws.Function('MyApi', {
	url: true,
	link: [bucket],
	handler: 'packages/trpc-api/src/trpcServerHandler.handler'
})
