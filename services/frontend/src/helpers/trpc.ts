import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@trpc-api/index'

export const trpc = createTRPCReact<AppRouter>()

export { AppRouter }
