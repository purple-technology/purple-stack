import type { AnyRootRoute } from '@tanstack/react-router'
import { createRoute } from '@tanstack/react-router'
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
	return (
		<section className="landing">
			<h1>Purple Stack v4</h1>
			<div className="landing__logos">
				<div className="logo-item">
					<a href="https://vitejs.dev" target="_blank" rel="noreferrer">
						<img src="/vite.svg" className="logo" alt="Vite logo" />
					</a>
					<span className="logo-label">Vite</span>
				</div>
				<div className="logo-item">
					<a href="https://react.dev" target="_blank" rel="noreferrer">
						<img src={reactLogo} className="logo react" alt="React logo" />
					</a>
					<span className="logo-label">React</span>
				</div>
				<div className="logo-item">
					<a
						href="https://tanstack.com/router"
						target="_blank"
						rel="noreferrer"
					>
						<img
							src="/tanstack.png"
							className="logo tanstack"
							alt="TanStack Router logo"
						/>
					</a>
					<span className="logo-label">TanStack Router</span>
				</div>
				<div className="logo-item">
					<a href="https://trpc.io" target="_blank" rel="noreferrer">
						<img src="/trpc.svg" className="logo trpc" alt="tRPC logo" />
					</a>
					<span className="logo-label">tRPC v11</span>
				</div>
				<div className="logo-item">
					<a href="https://sst.dev" target="_blank" rel="noreferrer">
						<img src="/sst.svg" className="logo sst" alt="SST logo" />
					</a>
					<span className="logo-label">SST v3</span>
				</div>
				<div className="logo-item">
					<a href="https://vitest.dev" target="_blank" rel="noreferrer">
						<img src="/vitest.svg" className="logo vitest" alt="Vitest logo" />
					</a>
					<span className="logo-label">Vitest</span>
				</div>
				<div className="logo-item">
					<a href="https://mise.jdx.dev" target="_blank" rel="noreferrer">
						<img src="/mise.svg" className="logo mise" alt="Mise logo" />
					</a>
					<span className="logo-label">Mise</span>
				</div>
				<div className="logo-item">
					<a href="https://biomejs.dev" target="_blank" rel="noreferrer">
						<img src="/biome.png" className="logo biome" alt="Biome logo" />
					</a>
					<span className="logo-label">Biome</span>
				</div>
				<div className="logo-item">
					<a href="https://zod.dev" target="_blank" rel="noreferrer">
						<img src="/zod.svg" className="logo zod" alt="Zod logo" />
					</a>
					<span className="logo-label">Zod v4</span>
				</div>
			</div>
		</section>
	)
}
