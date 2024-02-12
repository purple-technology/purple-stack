import '../../styles/globals.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useState } from 'react'
import superjson from 'superjson'

import { trpc } from '@/helpers/trpc'

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
	/* In case you want to use Cognito */
	// const token = useRef<string | undefined>()

	/* In case you want to use Cognito */
	// useEffect(() => {
	// 	token.current = cognito_tokens_goes_here.idToken
	// }, [cognito_token_goes_here?.idToken])

	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						// https://medium.com/doctolib/react-query-cachetime-vs-staletime-ec74defc483e
						staleTime: 10,
						retry: 3
					}
				}
			})
	)
	const [trpcClient] = useState(() =>
		trpc.createClient({
			transformer: superjson,
			links: [
				httpBatchLink({
					url: `${process.env['NEXT_PUBLIC_TRPC_API_URL']}trpc`,
					async headers() {
						return {
							/* In case you want to use Cognito */
							// authorization: token.current
						}
					}
				})
			]
		})
	)

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				<Head>
					<title>Purple Stack CHANGE_ME</title>
				</Head>
				<Component {...pageProps} />
			</QueryClientProvider>
		</trpc.Provider>
	)
}

export default App
