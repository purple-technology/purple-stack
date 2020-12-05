import { NextComponentType } from 'next'
import Document, {
	DocumentContext,
	DocumentInitialProps,
	Head,
	Html,
	Main,
	NextScript
} from 'next/document'
import React, { ReactElement } from 'react'
import { ServerStyleSheet } from 'styled-components'

type PurpleDocumentProps = {
	styleTags: ReactElement[]
}

export default class PurpleDocument extends Document<PurpleDocumentProps> {
	static async getInitialProps(
		ctx: DocumentContext
	): Promise<PurpleDocumentProps & DocumentInitialProps> {
		const initialProps = await Document.getInitialProps(ctx)

		// Step 1: Create an instance of ServerStyleSheet
		const sheet = new ServerStyleSheet()

		// Step 2: Retrieve styles from components in the page
		const page = await ctx.renderPage(
			(App: NextComponentType) => (props: object): ReactElement =>
				sheet.collectStyles(<App {...props} />)
		)

		// Step 3: Extract the styles as <style> tags
		const styleTags = sheet.getStyleElement()

		// Step 4: Pass styleTags as a prop
		return { ...initialProps, ...page, styleTags }
	}

	render(): JSX.Element {
		return (
			<Html>
				<Head>{this.props.styleTags}</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}
