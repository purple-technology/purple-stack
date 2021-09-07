function isError(arg: unknown): arg is Error {
	return typeof arg === 'object' && arg !== null && 'message' in arg
}

export const stringifyError = (error: unknown): string => {
	if (isError(error)) {
		return error.message
	}
	return `${error}`
}
