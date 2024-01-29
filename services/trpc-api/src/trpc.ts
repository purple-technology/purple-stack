import { Logger } from '@aws-lambda-powertools/logger'
import { initTRPC } from '@trpc/server'
import superjson from 'superjson'

export interface Context {
	readonly userCognitoId: string
}

const logger = new Logger({ serviceName: 'trpc-api' })

export const t = initTRPC.context<Context>().create({
	transformer: superjson,
	errorFormatter: (options) => {
		const getMessage = (): string => {
			switch (options.error.code) {
				case 'INTERNAL_SERVER_ERROR':
				case 'BAD_REQUEST':
					return options.error.message ?? 'Something went wrong.'
				default:
					return options.shape.message
			}
		}

		return {
			...options.shape,
			message: getMessage()
		}
	}
})

export const profiler = t.middleware(async (params) => {
	const startTime = Date.now()

	const result = await params.next()

	logger.debug('Procedure execution time', {
		path: params.path,
		executionTime: Date.now() - startTime
	})

	return result
})

export const publicProcedure = t.procedure.use(profiler)

export const router = t.router
export const middleware = t.middleware
