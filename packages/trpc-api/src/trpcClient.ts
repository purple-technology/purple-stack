import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from './appRouter'

export type AppRouterInputs = inferRouterInputs<AppRouter>
export type AppRouterOutputs = inferRouterOutputs<AppRouter>

/**
 * Get the API URL from environment variables.
 * This function handles the Vite-specific import.meta.env access,
 * keeping the environment variable concerns isolated to this module.
 */
function getApiUrl(): string {
	const url = import.meta.env.VITE_tRPCAPI_url as string | undefined

	if (!url) {
		throw new Error('VITE_tRPCAPI_url is not defined')
	}

	return url
}

export const appClient = createTRPCProxyClient<AppRouter>({
	links: [httpBatchLink({ url: getApiUrl() })]
})
