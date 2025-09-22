import {
	publicProcedure,
	router
} from '@purple-stack/trpc-api/src/trpcServerHandler'
import { z } from 'zod'

export const productsRouter = router({
	greet: publicProcedure
		.input(z.object({ name: z.string() }))
		.query(({ input }) => {
			return `Hello ${input.name}!`
		})
})
