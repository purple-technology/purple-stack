const log = (level: string, title: string, data?: object): string =>
	JSON.stringify({ level, title, data })

export const logInfo = (title: string, data?: object): void =>
	console.info(log('info', title, data))
export const logWarn = (title: string, data?: object): void =>
	console.warn(log('warning', title, data))

const logError = (title: string, data?: object): void =>
	console.error(log('error', title, data))

export class LogError extends Error {
	constructor(title: string, logData?: object, name?: string) {
		logError(title, logData)
		super(title)
		if (name) {
			this.name = name
		}
	}
}
