import { DepositPage } from '@purple-stack/transaction/web/pages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/deposit')({
	component: DepositPage
})
