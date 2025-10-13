import { describe, expect, test } from 'vitest'
import { Deposit } from '../index'

describe('Deposit.validateAmount', () => {
	test('should return valid for correct amount', () => {
		const result = Deposit.validateAmount(100)
		expect(result.valid).toBe(true)
		expect(result.error).toBeUndefined()
	})

	test('should return valid for amount with decimals', () => {
		const result = Deposit.validateAmount(100.99)
		expect(result.valid).toBe(true)
		expect(result.error).toBeUndefined()
	})

	test('should reject non-number values', () => {
		const result = Deposit.validateAmount('100')
		expect(result.valid).toBe(false)
		expect(result.error).toBe('Amount must be a valid number')
	})

	test('should reject NaN', () => {
		const result = Deposit.validateAmount(Number.NaN)
		expect(result.valid).toBe(false)
		expect(result.error).toBe('Amount must be a valid number')
	})

	test('should reject zero', () => {
		const result = Deposit.validateAmount(0)
		expect(result.valid).toBe(false)
		expect(result.error).toBe('Amount must be a positive number')
	})

	test('should reject negative numbers', () => {
		const result = Deposit.validateAmount(-50)
		expect(result.valid).toBe(false)
		expect(result.error).toBe('Amount must be a positive number')
	})

	test('should reject Infinity', () => {
		const result = Deposit.validateAmount(Number.POSITIVE_INFINITY)
		expect(result.valid).toBe(false)
		expect(result.error).toBe('Amount must be a finite number')
	})

	test('should reject -Infinity', () => {
		const result = Deposit.validateAmount(Number.NEGATIVE_INFINITY)
		expect(result.valid).toBe(false)
		expect(result.error).toBe('Amount must be a finite number')
	})

	test('should accept small positive amounts', () => {
		const result = Deposit.validateAmount(0.01)
		expect(result.valid).toBe(true)
		expect(result.error).toBeUndefined()
	})
})

describe('Deposit.formatAmount', () => {
	test('should format amount with dollar sign and 2 decimal places', () => {
		expect(Deposit.formatAmount(100)).toBe('$100.00')
		expect(Deposit.formatAmount(100.5)).toBe('$100.50')
		expect(Deposit.formatAmount(100.99)).toBe('$100.99')
	})
})
