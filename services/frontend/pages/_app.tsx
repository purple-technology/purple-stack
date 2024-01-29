import '../styles/globals.css'

import type { AppProps } from 'next/app'

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
	return <Component {...pageProps} />
}

export default App
