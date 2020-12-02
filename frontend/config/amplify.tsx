export default {
	// To make GraphQL subscriptions work on local server
	aws_appsync_dangerously_connect_to_http_endpoint_for_testing:
		process.env.API_URL === 'http://localhost:62222/graphql',
	aws_appsync_authenticationType: 'API_KEY',
	aws_appsync_apiKey: process.env.API_KEY,
	API: {
		graphql_endpoint: process.env.API_URL,
		graphql_endpoint_iam_region: process.env.AWS_REGION
	}
}
