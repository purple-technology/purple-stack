import '../../../../web/styles/shared.css'
import './DepositSummary.css'

export type DepositSummaryProps = {
	lastAmount?: number
	status?: 'idle' | 'pending' | 'success'
}

const statusCopy: Record<Required<DepositSummaryProps>['status'], string> = {
	idle: 'No deposit started yet',
	pending: 'Submitting your deposit...',
	success: 'Deposit placed successfully!'
}

export function DepositSummary({
	lastAmount,
	status = 'idle'
}: DepositSummaryProps) {
	return (
		<section
			className="deposit-summary transaction-card transaction-card--dark"
			aria-live="polite"
		>
			<h2 className="deposit-summary__heading">Deposit summary</h2>
			<p className="deposit-summary__status">{statusCopy[status]}</p>
			{typeof lastAmount === 'number' ? (
				<p className="deposit-summary__amount">
					Last amount: ${lastAmount.toFixed(2)}
				</p>
			) : null}
		</section>
	)
}
