import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getTimestamp } from '../src/index'

vi.mock('moment', () => ({
	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	default: () => ({
		format: (): string => '2024-01-01 01:01:01.001'
	})
}))

describe('addTodo', () => {
	beforeEach(() => {
		vi.resetAllMocks()
	})

	it('should succeed', async () => {
		expect(getTimestamp()).toEqual('2024-01-01 01:01:01.001')
	})
})
