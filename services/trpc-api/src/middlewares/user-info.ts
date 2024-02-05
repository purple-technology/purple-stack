import { TRPCError } from '@trpc/server'

import { t } from '../trpc'

const someDatabaseCall = (
	userCognitoId: string
):
	| { userCognitoId: string; name: string; balance: number; currency: string }
	| undefined => {
	return {
		userCognitoId,
		name: 'Karel',
		balance: 1000,
		currency: 'JPY'
	}
}

export const userInfo = t.middleware(async (params) => {
	const user = someDatabaseCall(params.ctx.userCognitoId)

	if (typeof user === 'undefined') {
		throw new TRPCError({
			code: 'BAD_REQUEST',
			message: 'User not found.'
		})
	}

	return params.next({
		ctx: {
			...params.ctx,
			user
		}
	})
})
