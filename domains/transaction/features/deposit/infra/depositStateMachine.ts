// Define the deposit processing state machine
const validateDeposit = sst.aws.StepFunctions.pass({
	name: 'ValidateDeposit',
	comment: 'Validate deposit amount and account'
})

const processDeposit = sst.aws.StepFunctions.pass({
	name: 'ProcessDeposit',
	comment: 'Process the deposit transaction'
})

const notifySuccess = sst.aws.StepFunctions.succeed({
	name: 'NotifySuccess',
	comment: 'Deposit completed successfully'
})

// Define the state machine workflow
const definition = validateDeposit.next(processDeposit).next(notifySuccess)

export const depositStateMachine = new sst.aws.StepFunctions(
	'DepositStateMachine',
	{
		definition
	}
)
