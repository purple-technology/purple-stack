import type { AnyRootRoute } from '@tanstack/react-router'
import { createRoute } from '@tanstack/react-router'
import { useState } from 'react'
import reactLogo from '../assets/react.svg'

// Factory function to create the home route with the root route
export const createHomeRoute = <TRootRoute extends AnyRootRoute>(
	rootRoute: TRootRoute
) =>
	createRoute({
		getParentRoute: () => rootRoute,
		path: '/',
		component: HomePage
	})

function HomePage() {
	const [count, setCount] = useState(0)

	return (
		<section className="landing">
			<div className="landing__logos">
				<a href="https://vitejs.dev" target="_blank" rel="noreferrer">
					<img src="/vite.svg" className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank" rel="noreferrer">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>Purple Stack v4 playground</h1>
			<div className="card">
				<button onClick={() => setCount((value) => value + 1)}>
					count is {count}
				</button>
			</div>
		</section>
	)
}
