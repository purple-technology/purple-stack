import '../global.css'

import Amplify from 'aws-amplify'
import { AppProps } from 'next/app'
import Head from 'next/head'
import React, { useEffect } from 'react'
import { createGlobalStyle, ThemeProvider } from 'styled-components'

import amplifyConfig from '../config/amplify'
import { Theme } from '../config/Theme'
import TodosModel from '../src/models/todos'
import i18n from './../i18n.js'

const GlobalStyle = createGlobalStyle`
	body {
		font: 14px 'Helvetica Neue', Helvetica, Arial, sans-serif;
    line-height: 1.4em;
    background: #f5f5f5;
    color: #4d4d4d;
    min-width: 230px;
    max-width: 550px;
    margin: 0 auto !important;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-weight: 300;
	}

	:focus {
		outline: 0;
	}

	button {
		margin: 0;
    padding: 0;
    border: 0;
    background: none;
    font-size: 100%;
    vertical-align: baseline;
    font-family: inherit;
    font-weight: inherit;
    color: inherit;
    -webkit-appearance: none;
    appearance: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
	}
`

Amplify.configure(amplifyConfig)

const PurpleApp: React.FC<AppProps> = ({ Component, pageProps }) => {
	useEffect(() => {
		i18n.setDefaultNamespace('default')
	}, [])

	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
				/>
				<link
					rel="shortcut icon"
					type="image/png"
					href={`${process.env.CDN_URL}/img/favicon.ico`}
				/>
				<title>Purple App</title>
			</Head>

			<ThemeProvider theme={Theme}>
				<GlobalStyle />
				<TodosModel.Provider>
					<Component {...pageProps} />
				</TodosModel.Provider>
			</ThemeProvider>
		</>
	)
}

export default PurpleApp
