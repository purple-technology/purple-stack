import type { AnyRouter } from '@trpc/server'
import { router } from './trpc'

/**
 * Creates the app router by composing domain routers.
 * This function should be called at the application level with all domain routers.
 *
 * Example:
 * ```ts
 * import { transactionRouter } from '@purple-stack/transaction/api/transactionRouter'
 * const appRouter = createAppRouter({
 *   transaction: transactionRouter
 * })
 * ```
 */
export function createAppRouter<TRouters extends Record<string, AnyRouter>>(
	routers: TRouters
) {
	return router(routers)
}

export type CreateAppRouter = typeof createAppRouter
