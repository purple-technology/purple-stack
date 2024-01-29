import moment from 'moment'

export const getTimestamp = (): string =>
	moment().format('YYYY-MM-DD HH:mm:ss.SSS')
