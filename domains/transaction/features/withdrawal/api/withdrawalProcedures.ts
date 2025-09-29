import { publicProcedure } from '@purple-stack/trpc-api/src/trpc'
import { z } from 'zod'

export const withdraw = publicProcedure
	.input(
		z.object({
			amount: z.number().positive()
		})
	)
	.mutation(({ input }) => {
		return {
			success: true,
			message: `Withdrawal of ${input.amount} initiated`
		}
	})
