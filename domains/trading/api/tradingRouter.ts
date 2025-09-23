import { publicProcedure, router } from '@purple-stack/trpc-api/src/trpc'
import { z } from 'zod'

export const tradingRouter = router({
	greet: publicProcedure
		.input(z.object({ name: z.string() }))
		.query(({ input }) => {
			return `Hello ${input.name}!`
		})
})
