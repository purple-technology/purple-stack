/**
 * Converts a stage name to a URL-friendly part using camelCase.
 * The first word is lowercase, subsequent words are capitalized.
 *
 * @param stage - The stage name to convert
 * @returns The URL-friendly camelCase string
 *
 * @example
 * ```typescript
 * stageToUrlPart('production') // 'production'
 * stageToUrlPart('staging-env') // 'stagingEnv'
 * stageToUrlPart('dev_branch') // 'devBranch'
 * stageToUrlPart('feature branch') // 'featureBranch'
 * ```
 */
export function stageToUrlPart(stage: string): string {
	return stage
		.toLowerCase()
		.split(/[-_\s]+/)
		.map((word, index) =>
			index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
		)
		.join('')
}


