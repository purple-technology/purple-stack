import Head from 'next/head'
import React from 'react'
import { useTranslation } from 'react-i18next'

import TodosList from '../src/scenes/TodosList'

const Home: React.FC = () => {
	const { t } = useTranslation()
	return (
		<React.Fragment>
			<Head>
				<title>{t('main.title')}</title>
			</Head>
			<TodosList />
		</React.Fragment>
	)
}

export default Home
