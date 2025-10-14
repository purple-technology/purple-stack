import type { AnyRootRoute } from '@tanstack/react-router'
import { createRoute } from '@tanstack/react-router'
import { WithdrawalPage } from './pages/WithdrawalPage'

// Factory function to create the withdrawal route with the root route from the main app
export const createWithdrawalRoute = <TRootRoute extends AnyRootRoute>(
	rootRoute: TRootRoute
) =>
	createRoute({
		getParentRoute: () => rootRoute,
		path: 'withdrawal',
		component: WithdrawalPage
	})
