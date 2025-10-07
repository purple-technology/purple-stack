import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn'
import { publicProcedure } from '@purple-stack/trpc-api/trpc'
import { Resource } from 'sst'
import { z } from 'zod'

const sfnClient = new SFNClient({})

export const deposit = publicProcedure
	.input(
		z.object({
			amount: z.number().positive(),
			accountId: z.string().optional()
		})
	)
	.mutation(async ({ input }) => {
		// Start the state machine execution
		const executionName = `deposit-${Date.now()}`
		const command = new StartExecutionCommand({
			stateMachineArn: Resource.DepositStateMachine.arn,
			name: executionName,
			input: JSON.stringify({
				amount: input.amount,
				accountId: input.accountId || 'default-account',
				timestamp: new Date().toISOString()
			})
		})

		try {
			const response = await sfnClient.send(command)

			return {
				success: true,
				message: `Deposit of ${input.amount} initiated`,
				executionArn: response.executionArn,
				executionName
			}
		} catch (error) {
			console.error('Failed to start state machine:', error)
			throw new Error('Failed to initiate deposit processing')
		}
	})
