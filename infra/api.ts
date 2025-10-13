import { depositStateMachine } from '../domains/transaction/features/deposit/stack'
export const tRPCAPI = new sst.aws.Function('tRPCAPI', {
	url: true,
	link: [depositStateMachine],
	handler: 'infra/src/apiHandler.handler'
})
