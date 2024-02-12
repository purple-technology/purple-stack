import { Logger } from '@aws-lambda-powertools/logger'
import { z } from 'zod'

import { userInfo } from '../../middlewares/user-info'
import { publicProcedure } from '../../trpc'

const logger = new Logger({ serviceName: 'trpc-api-todos-create' })

export const createTodos = publicProcedure
	.use(userInfo)
	.input(
		z.object({
			name: z.string()
		})
	)
	.mutation(async ({ ctx, input }) => {
		logger.info('created', { ctx, input })

		return {
			created: true,
			input,
			ctx
		}
	})
