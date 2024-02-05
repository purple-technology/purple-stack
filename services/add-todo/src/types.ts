import { z } from 'zod'

export const schema = z.object({
	text: z.string().min(1)
})

export type Input = z.infer<typeof schema>

export type Output = {
	success: boolean
}
