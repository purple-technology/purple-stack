/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */
const edgeList = {
	master: 'arn:aws:lambda:us-east-1:ACCOUNT_ID:function:LAMBDA_NAME:VERSION',
	staging: 'arn:aws:lambda:us-east-1:ACCOUNT_ID:function:LAMBDA_NAME:VERSION'
}

// Goal of this is to preserve query parameters during S3 trailing slash redirect
const getLambdaEdgeFunctionArn = (serverless) => {
	const { stage } = serverless.service.provider
	const value = edgeList[stage]
	if (!value) return edgeList.develop
	return edgeList[stage]
}

module.exports = {
	getLambdaEdgeFunctionArn
}
