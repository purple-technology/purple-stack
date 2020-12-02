import 'source-map-support/register'

import { AppSyncHandler } from '@package/appsync-types'
import { getConfig } from '@package/config'
import { getEnvVar } from '@package/env-vars'
import { Mutation, MutationAddTodoArgs, Status } from '@package/graphql-types'
import AWS from 'aws-sdk'

const stepFunctions = new AWS.StepFunctions()

export const handler: AppSyncHandler<
	MutationAddTodoArgs,
	{},
	Mutation['addTodo']
> = async (event): Promise<Mutation['addTodo']> => {
	const config = getConfig(getEnvVar('STAGE'))

	try {
		const bannedWord = event.arguments.text
			.split(' ')
			.find((word) => config.bannedWords.includes(word.trim().toLowerCase()))

		if (typeof bannedWord !== 'undefined') {
			throw new Error(`Contains banned word "${bannedWord}"`)
		}

		await stepFunctions
			.startExecution({
				stateMachineArn: getEnvVar('ADD_TODO_SM'),
				input: JSON.stringify({
					text: event.arguments.text
				})
			})
			.promise()
		return Status.Success
	} catch (err) {
		console.error(err)
		throw err.message
	}
}
