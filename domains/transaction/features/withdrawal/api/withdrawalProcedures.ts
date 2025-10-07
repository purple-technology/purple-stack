import { publicProcedure } from '@purple-stack/trpc-api/trpc'

export const withdrawalLimits = publicProcedure.query(() => {
	const dailyLimit = Math.floor(Math.random() * 5000) + 1000
	const availableBalance = Math.floor(Math.random() * 10000) + 500
	const maxWithdrawal = Math.min(dailyLimit, availableBalance)

	return {
		dailyLimit,
		availableBalance,
		maxWithdrawal,
		currency: 'USD'
	}
})
