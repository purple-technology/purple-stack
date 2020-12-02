import { useContext } from 'react'

import { Model } from './modelify'

export function useModel<T extends object>(model: Model<T>): T {
	const modelData = useContext(model.model)
	if (modelData === null) {
		throw new Error('Model data is null')
	}
	return modelData
}
