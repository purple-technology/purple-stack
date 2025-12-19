/// <reference path="../../../../../.sst/platform/config.d.ts" />

// Define the validation Lambda function
const validateAmountLambda = new sst.aws.Function(
	'DepositValidateAmountLambda',
	{
		handler:
			'domains/transaction/features/deposit/backend/validateAmount.handler'
	}
)

const validateAmount = sst.aws.StepFunctions.lambdaInvoke({
	name: 'ValidateAmount',
	function: validateAmountLambda,
	payload: {
		input: '{% $states.input %}'
	}
})

const processDeposit = sst.aws.StepFunctions.pass({
	name: 'ProcessDeposit'
})

const notifySuccess = sst.aws.StepFunctions.succeed({
	name: 'NotifySuccess'
})

const validationFailed = sst.aws.StepFunctions.fail({
	name: 'ValidationFailed',
	error: 'ValidationError',
	cause: '$.Payload.error'
})

const checkValidation = sst.aws.StepFunctions.choice({
	name: 'CheckValidation'
})

const definition = validateAmount.next(
	checkValidation
		.when(
			'{% $states.input.Payload.valid %}',
			processDeposit.next(notifySuccess)
		)
		.otherwise(validationFailed)
)

export const depositStateMachine = new sst.aws.StepFunctions(
	'DepositStateMachine',
	{
		definition
	}
)
