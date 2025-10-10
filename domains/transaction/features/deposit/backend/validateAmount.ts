import type { Handler } from 'aws-lambda'

type ValidationInput = {
	amount: number
	timestamp: string
}

type ValidationOutput = {
	valid: boolean
	amount: number
	timestamp: string
	error?: string
}

type LambdaEvent = {
	input: ValidationInput
}

export const handler: Handler<LambdaEvent, ValidationOutput> = async (
	event
) => {
	// Extract the actual input from the wrapper
	if (!event.input) {
		return {
			valid: false,
			amount: 0,
			timestamp: new Date().toISOString(),
			error: 'No input provided to validation function'
		}
	}

	const { amount, timestamp } = event.input

	if (typeof amount !== 'number' || Number.isNaN(amount)) {
		return {
			valid: false,
			amount,
			timestamp,
			error: 'Amount must be a valid number'
		}
	}

	if (amount <= 0) {
		return {
			valid: false,
			amount,
			timestamp,
			error: 'Amount must be a positive number'
		}
	}

	return {
		valid: true,
		amount,
		timestamp
	}
}
