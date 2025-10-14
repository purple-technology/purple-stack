import type { AnyRootRoute } from '@tanstack/react-router'
import { createRoute } from '@tanstack/react-router'
import { DepositPage } from './pages/DepositPage'

// Factory function to create the deposit route with the root route from the main app
export const createDepositRoute = <TRootRoute extends AnyRootRoute>(
	rootRoute: TRootRoute
) =>
	createRoute({
		getParentRoute: () => rootRoute,
		path: 'deposit',
		component: DepositPage
	})
