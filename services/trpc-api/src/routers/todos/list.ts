import { Logger } from '@aws-lambda-powertools/logger'
import { z } from 'zod'

import { userInfo } from '../../middlewares/user-info'
import { publicProcedure } from '../../trpc'

const logger = new Logger({ serviceName: 'trpc-api-todos-list' })

export const listTodos = publicProcedure
	.use(userInfo)
	.input(
		z.object({
			id: z.string()
		})
	)
	.query(async ({ ctx, input }) => {
		logger.info('list', { ctx, input })

		return [
			{
				name: 'a'
			},
			{
				name: 'b'
			}
		]
	})
