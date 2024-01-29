/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'

export default defineConfig(() => {
	return {
		test: {
			testTimeout: 30000,
			alias: {
				'@packages/': new URL('./packages/', import.meta.url).pathname
			},
			coverage: {
				cleanOnRerun: true,
				enabled: true,
				clean: true,
				all: true,
				exclude: [
					'services/frontend',
					'stacks',
					'**/*.d.ts',
					'sst.config.ts',
					'.sst'
				],
				extension: ['.ts'],
				100: true
			}
		}
	}
})
