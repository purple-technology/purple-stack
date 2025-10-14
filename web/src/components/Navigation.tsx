import { Link } from '@tanstack/react-router'

export function Navigation() {
	return (
		<nav className="app-nav" aria-label="Main navigation">
			<Link
				to="/"
				className="app-nav__link"
				activeProps={{
					className: 'app-nav__link app-nav__link--active'
				}}
			>
				Home
			</Link>
			<Link
				to="/deposit"
				className="app-nav__link"
				activeProps={{
					className: 'app-nav__link app-nav__link--active'
				}}
			>
				Deposit demo
			</Link>
			<Link
				to="/withdrawal"
				className="app-nav__link"
				activeProps={{
					className: 'app-nav__link app-nav__link--active'
				}}
			>
				Withdrawal demo
			</Link>
		</nav>
	)
}
