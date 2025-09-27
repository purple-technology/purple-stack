import { transactionRouter } from '@purple-stack/transaction/api/transactionRouter'
import { router } from './trpc'

export const appRouter = router({
	transaction: transactionRouter
})

export type AppRouter = typeof appRouter
