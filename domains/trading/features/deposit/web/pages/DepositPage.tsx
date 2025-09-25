import { useState } from 'react'
import { DepositForm } from '../components/DepositForm'
import { DepositSummary } from '../components/DepositSummary'

export function DepositPage() {
	const [lastAmount, setLastAmount] = useState<number | undefined>()
	const [status, setStatus] = useState<'idle' | 'pending' | 'success'>('idle')

	const handleSubmit = async (amount: number) => {
		setStatus('pending')
		await new Promise((resolve) => setTimeout(resolve, 600))
		setLastAmount(amount)
		setStatus('success')
	}

	return (
		<main className="deposit-page">
			<header className="deposit-page__header">
				<h1>Deposit funds</h1>
				<p>Prototype vertical slice for trading › deposit</p>
			</header>
			<section className="deposit-page__content">
				<DepositForm onSubmit={handleSubmit} initialAmount={250} />
				<DepositSummary lastAmount={lastAmount} status={status} />
			</section>
		</main>
	)
}
