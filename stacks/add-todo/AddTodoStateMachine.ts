import type {
	Chain,
	INextable,
	IStateMachine,
	State
} from 'aws-cdk-lib/aws-stepfunctions'
import {
	DefinitionBody,
	Pass,
	Result,
	StateMachine
} from 'aws-cdk-lib/aws-stepfunctions'
import { LambdaInvoke } from 'aws-cdk-lib/aws-stepfunctions-tasks'
import { Construct } from 'constructs'
import type { App } from 'sst/constructs'
import { Function } from 'sst/constructs'

export interface StateMachineProps {
	servicePath: string
}

export class AddTodoStateMachine extends Construct {
	private props: StateMachineProps
	private app: App

	public stateMachine: IStateMachine

	constructor(scope: Construct, id: string, props: StateMachineProps) {
		super(scope, id)
		this.props = props
		this.app = scope.node.root as App

		// Your state machine definition is here
		const stateMachineDefinition: Chain = this.addTodoStep().next(
			this.examplePassStep()
		)

		this.stateMachine = new StateMachine(this, 'StateMachine', {
			stateMachineName: `${this.app.stage}-${this.app.name}-add-todo`,
			definitionBody: DefinitionBody.fromChainable(stateMachineDefinition)
		})
	}

	private addTodoStep(): State & INextable {
		return new LambdaInvoke(this, 'Get clients waiting for voucher', {
			lambdaFunction: new Function(this, 'AddTodoFunction', {
				handler: this.getHandlerPath('addTodo')
			}),
			payloadResponseOnly: true
		})
	}

	private examplePassStep(): State & INextable {
		return new Pass(this, 'Just add example Pass', {
			result: Result.fromObject({
				data: 'hello'
			}),
			resultPath: '$.passExampleResult'
		})
	}

	private getHandlerPath(handlerName: string): string {
		return `${this.props.servicePath}/${handlerName}/index.handler`
	}
}
