import { depositStateMachine } from '../domains/transaction/features/deposit/stack'

export function createApi(router: sst.aws.Router) {
	return new sst.aws.Function('tRPCAPI', {
		url: { router: { instance: router, path: '/api' } },
		link: [depositStateMachine],
		handler: 'infra/src/apiHandler.handler'
	})
}
