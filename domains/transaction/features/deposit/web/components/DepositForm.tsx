import { type FormEvent, useState } from 'react'
import { Button } from '../../../../web/components'
import '../../../../web/styles/shared.css'
import './DepositForm.css'

export type DepositFormProps = {
	onSubmit: (amount: number) => void | Promise<void>
	initialAmount?: number
}

export function DepositForm({
	onSubmit,
	initialAmount = 100
}: DepositFormProps) {
	const [amount, setAmount] = useState(initialAmount)
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (Number.isNaN(amount) || amount <= 0) {
			setError('Enter a positive amount')
			return
		}

		setError(null)
		await onSubmit(amount)
	}

	return (
		<form className="deposit-form transaction-card" onSubmit={handleSubmit}>
			<label className="deposit-form__label" htmlFor="deposit-amount">
				Amount
			</label>
			<input
				id="deposit-amount"
				className="transaction-input"
				type="number"
				min={1}
				value={amount}
				onChange={(event) => setAmount(event.target.valueAsNumber)}
			/>
			{error ? <p className="deposit-form__error">{error}</p> : null}
			<Button type="submit">Start deposit</Button>
		</form>
	)
}
