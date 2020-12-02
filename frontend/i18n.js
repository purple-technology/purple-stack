import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// the translations
const resources = {
	en: {
		default: require('./public/locales/en/default.json')
	}
}

i18n
	.use(initReactI18next) // passes i18n down to react-i18next
	.init({
		ns: ['default'],
		defaultNS: 'default',
		lng: 'en',
		resources,
		fallbackLng: 'en',
		keySeparator: '.', // we do not use keys in form messages.welcome
		interpolation: {
			escapeValue: false // react already safes from xss
		}
	})

export default i18n
