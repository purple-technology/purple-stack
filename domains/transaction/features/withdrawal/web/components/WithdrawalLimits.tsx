export type WithdrawalLimitsProps = {
	dailyLimit?: number
	availableBalance?: number
	maxWithdrawal?: number
	currency?: string
	status?: 'idle' | 'loading' | 'success' | 'error'
}

const statusCopy: Record<Required<WithdrawalLimitsProps>['status'], string> = {
	idle: 'Ready to check withdrawal limits',
	loading: 'Loading withdrawal limits...',
	success: 'Withdrawal limits loaded',
	error: 'Failed to load withdrawal limits'
}

export function WithdrawalLimits({
	dailyLimit,
	availableBalance,
	maxWithdrawal,
	currency = 'USD',
	status = 'idle'
}: WithdrawalLimitsProps) {
	return (
		<section className="withdrawal-limits" aria-live="polite">
			<h2 className="withdrawal-limits__heading">Withdrawal Limits</h2>
			<p className="withdrawal-limits__status">{statusCopy[status]}</p>
			{status === 'success' && typeof maxWithdrawal === 'number' ? (
				<div className="withdrawal-limits__details">
					<p className="withdrawal-limits__item">
						<strong>Daily Limit:</strong> {currency} {dailyLimit?.toFixed(2)}
					</p>
					<p className="withdrawal-limits__item">
						<strong>Available Balance:</strong> {currency}{' '}
						{availableBalance?.toFixed(2)}
					</p>
					<p className="withdrawal-limits__item withdrawal-limits__max">
						<strong>Max Withdrawal:</strong> {currency}{' '}
						{maxWithdrawal.toFixed(2)}
					</p>
				</div>
			) : null}
		</section>
	)
}

