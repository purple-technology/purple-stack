import { depositStateMachine } from '../domains/transaction/features/deposit/stack'
import { bucket } from './storage'

//todo: rename and move this
export const tRPCAPI = new sst.aws.Function('tRPCAPI', {
	url: true,
	link: [bucket, depositStateMachine],
	handler: 'packages/trpc-api/src/trpcServerHandler.handler'
})
