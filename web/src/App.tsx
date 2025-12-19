import {
	createDepositRoute,
	createWithdrawalRoute
} from '@purple-stack/transaction/web/routes'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import './App.css'
import { createHomeRoute } from './router/home.route'
import { rootRoute } from './router/root.route'

// Build the route tree with vertical slice routes
// Each feature provides a factory function that receives the root route
const homeRoute = createHomeRoute(rootRoute)
const depositRoute = createDepositRoute(rootRoute)
const withdrawalRoute = createWithdrawalRoute(rootRoute)

const routeTree = rootRoute.addChildren([
	homeRoute,
	depositRoute,
	withdrawalRoute
])

// Create a new router instance
const router = createRouter({ routeTree })

function App() {
	return <RouterProvider router={router} />
}

export default App
