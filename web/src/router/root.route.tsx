import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Navigation } from '../components/Navigation'
import '../App.css'

export const rootRoute = createRootRoute({
	component: RootComponent
})

function RootComponent() {
	return (
		<div className="app-shell">
			<Navigation />
			<div className="app-content">
				<Outlet />
			</div>
		</div>
	)
}
