import { useState } from 'react'
import './App.css'
import { DepositPage } from '@purple-stack/trading/web/pages'
import viteLogo from '/vite.svg'
import reactLogo from './assets/react.svg'

type AppView = 'home' | 'deposit'

function HomePage() {
	const [count, setCount] = useState(0)

	return (
		<section className="landing">
			<div className="landing__logos">
				<a href="https://vitejs.dev" target="_blank" rel="noreferrer">
					<img src={viteLogo} className="logo" alt="Vite logo" />
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
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
		</section>
	)
}

function App() {
	const [view, setView] = useState<AppView>('home')

	return (
		<div className="app-shell">
			<nav className="app-nav" aria-label="Main navigation">
				<button
					type="button"
					className={`app-nav__link${view === 'home' ? ' app-nav__link--active' : ''}`}
					onClick={() => setView('home')}
				>
					Home
				</button>
				<button
					type="button"
					className={`app-nav__link${view === 'deposit' ? ' app-nav__link--active' : ''}`}
					onClick={() => setView('deposit')}
				>
					Deposit demo
				</button>
			</nav>
			<div className="app-content">
				{view === 'home' ? <HomePage /> : <DepositPage />}
			</div>
		</div>
	)
}

export default App
