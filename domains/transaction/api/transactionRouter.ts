import { router } from '@purple-stack/trpc-api/trpc'
import { deposit } from '../features/deposit/api/depositProcedures'
import { withdrawalLimits } from '../features/withdrawal/api/withdrawalProcedures'

export const transactionRouter = router({
	deposit,
	withdrawalLimits
})
