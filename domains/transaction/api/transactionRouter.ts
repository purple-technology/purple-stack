import { router } from '@purple-stack/trpc-api/src/trpc'
import { depositProcedures } from '../features/deposit/api/depositProcedures'
import { withdrawalProcedures } from '../features/withdrawal/api/withdrawalProcedures'

export const transactionRouter = router({
	deposit: depositProcedures,
	withdrawal: withdrawalProcedures
})
