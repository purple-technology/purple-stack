import { publicProcedure } from '@purple-stack/trpc-api/src/trpc'
import { z } from 'zod'

export const deposit = publicProcedure
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
