import { publicProcedure, router } from '@purple-stack/trpc-api/src/trpc'
import { z } from 'zod'

export const depositProcedures: ReturnType<typeof router> = router({
	deposit: publicProcedure
		.input(
			z.object({
				amount: z.number().positive()
			})
		)
		.mutation(({ input }) => {
			return {
				success: true,
				message: `Deposit of ${input.amount} initiated`
			}
		})
})
