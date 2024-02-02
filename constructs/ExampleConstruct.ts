import { Construct } from 'constructs'

export interface ExampleConstructProps {}

export class ExampleConstruct extends Construct {
	constructor(scope: Construct, id: string, props: ExampleConstructProps) {
		super(scope, id)
		// here goes your construct code
		// make sure to use "this" when providing "scope" to child constructs
		console.log(props)
	}
}
