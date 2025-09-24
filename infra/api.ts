import { bucket } from './storage'

//todo: rename and move this
export const tRPCAPI = new sst.aws.Function('tRPCAPI', {
	url: true,
	link: [bucket],
	handler: 'packages/trpc-api/src/trpcServerHandler.handler'
})
