import { appClient } from '@purple-stack/trpc-api/src/trpcClient'
import { useEffect, useState } from 'react'
import { WithdrawalLimits } from '../components/WithdrawalLimits'

export function WithdrawalPage() {
	const [limits, setLimits] = useState<
		| {
				dailyLimit: number
				availableBalance: number
				maxWithdrawal: number
				currency: string
		  }
		| undefined
	>()
	const [status, setStatus] = useState<
		'idle' | 'loading' | 'success' | 'error'
	>('loading')

	const fetchLimits = async () => {
		setStatus('loading')
		try {
			const result = await appClient.transaction.withdrawalLimits.query()
			setLimits(result)
			setStatus('success')
		} catch (error) {
			console.error('Failed to fetch withdrawal limits', error)
			setStatus('error')
		}
	}

	// Fetch limits on component mount
	useEffect(() => {
		fetchLimits()
	}, [])

	return (
		<main className="withdrawal-page">
			<header className="withdrawal-page__header">
				<h1>Withdrawal</h1>
				<p>Prototype vertical slice for transaction › withdrawal</p>
			</header>
			<section className="withdrawal-page__content">
				<div className="withdrawal-actions">
					<button
						className="withdrawal-actions__button"
						onClick={fetchLimits}
						disabled={status === 'loading'}
					>
						{status === 'loading' ? 'Refreshing...' : 'Refresh Limits'}
					</button>
				</div>
				<WithdrawalLimits
					dailyLimit={limits?.dailyLimit}
					availableBalance={limits?.availableBalance}
					maxWithdrawal={limits?.maxWithdrawal}
					currency={limits?.currency}
					status={status}
				/>
			</section>
		</main>
	)
}
