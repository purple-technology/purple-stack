/**
 * Deposit validation and business logic
 */
export namespace Deposit {
	/**
	 * Validation result type
	 */
	export type ValidationResult = {
		valid: boolean
		error?: string
	}

	/**
	 * Validates a deposit amount according to business rules
	 * @param amount - The deposit amount to validate
	 * @returns Validation result with an error message if invalid
	 */
	export function validateAmount(amount: unknown): ValidationResult {
		// Check if amount is a number
		if (typeof amount !== 'number') {
			return {
				valid: false,
				error: 'Amount must be a valid number'
			}
		}

		// Check if amount is NaN
		if (Number.isNaN(amount)) {
			return {
				valid: false,
				error: 'Amount must be a valid number'
			}
		}

		// Check if amount is finite (not Infinity or -Infinity)
		if (!Number.isFinite(amount)) {
			return {
				valid: false,
				error: 'Amount must be a finite number'
			}
		}

		// Check if amount is positive
		if (amount <= 0) {
			return {
				valid: false,
				error: 'Amount must be a positive number'
			}
		}

		return {
			valid: true
		}
	}

	/**
	 * Format a deposit amount for display
	 * @param amount - The amount to format
	 * @returns Formatted amount string
	 */
	export function formatAmount(amount: number): string {
		return `$${amount.toFixed(2)}`
	}
}
