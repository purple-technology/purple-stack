import deepFreeze, { DeepReadonly } from 'deep-freeze'

import { Config as PureConfig } from './types'

export type Config = DeepReadonly<PureConfig>

/*
	BOILERPLATE CODE
	add stage
*/
enum Stage {
	master,
	staging
}

export const getConfig = (stage: string): Config => {
	function branch<T>(defaultValue: T, config: { [stage in Stage]?: T }): T {
		const targetStage = Stage[stage as unknown as Stage] as unknown as Stage
		const cfgValue = config[targetStage]
		if (typeof cfgValue !== 'undefined') {
			return cfgValue
		}
		return defaultValue
	}

	const cfg: PureConfig = {
		/*
			BOILERPLATE CODE
			replace with your configurations
		*/
		example: {
			on: branch(false, {
				[Stage.master]: true
			})
		},
		bannedWords: ['car', 'man', 'dog']
	}
	return deepFreeze(cfg)
}
