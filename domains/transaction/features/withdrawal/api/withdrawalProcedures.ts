import { publicProcedure, router } from '@purple-stack/trpc-api/src/trpc'
import { z } from 'zod'

export const withdrawalProcedures = router({
	withdraw: publicProcedure
		.input(
			z.object({
				amount: z.number().positive()
			})
		)
		.mutation(({ input }) => {
			return {
				success: true,
				message: `Withdrawal of ${input.amount} initiated`,
			}
		})
})
