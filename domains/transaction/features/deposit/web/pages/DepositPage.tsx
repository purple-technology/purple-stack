import { appClient } from '@purple-stack/trpc-api/src/trpcClient'
import { useState } from 'react'
import { DepositForm } from '../components/DepositForm'
import { DepositSummary } from '../components/DepositSummary'

export function DepositPage() {
	const [lastAmount, setLastAmount] = useState<number | undefined>()
	const [status, setStatus] = useState<'idle' | 'pending' | 'success'>('idle')

	const handleSubmit = async (amount: number) => {
		setStatus('pending')
		try {
			const result = await appClient.transaction.deposit.deposit.mutate({
				amount
			})
			if (result.success) {
				setLastAmount(amount)
				setStatus('success')
				return
			}
		} catch (error) {
			console.error('Deposit failed', error)
		}
		setStatus('idle')
	}

	return (
		<main className="deposit-page">
			<header className="deposit-page__header">
				<h1>Deposit funds</h1>
				<p>Prototype vertical slice for transaction › deposit</p>
			</header>
			<section className="deposit-page__content">
				<DepositForm onSubmit={handleSubmit} initialAmount={250} />
				<DepositSummary lastAmount={lastAmount} status={status} />
			</section>
		</main>
	)
}
