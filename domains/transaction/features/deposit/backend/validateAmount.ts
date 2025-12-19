import { Deposit } from '@purple-stack/core/deposit'
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
	formattedAmount?: string
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

	// Use the core package validation logic via namespace
	const validationResult = Deposit.validateAmount(amount)

	if (!validationResult.valid) {
		return {
			valid: false,
			amount,
			timestamp,
			error: validationResult.error
		}
	}

	// Additional example: use other namespace functions
	const formattedAmount = Deposit.formatAmount(amount)

	return {
		valid: true,
		amount,
		timestamp,
		formattedAmount
	}
}
