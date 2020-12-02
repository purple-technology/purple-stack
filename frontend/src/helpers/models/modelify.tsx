import React, { createContext } from 'react'

export type ModelProvider<ModelState> = React.FC<{
	value?: ModelState
}>

export interface Model<ModelState extends object> {
	model: React.Context<ModelState | null>
	Provider: ModelProvider<ModelState>
}

export function modelify<ModelState extends object>(
	runHandler: () => ModelState
): Model<ModelState> {
	const context = createContext<ModelState | null>(null)

	const Provider: ModelProvider<ModelState> = ({ value, children }) => {
		const state: ModelState = runHandler()
		return (
			<context.Provider value={value ?? state}>{children}</context.Provider>
		)
	}

	return {
		model: context,
		Provider: React.memo(Provider)
	}
}
