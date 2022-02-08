/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const { getStage } = require('@purple/serverless-git-branch-stage-plugin')

module.exports = {
	trailingSlash: true,
	assetPrefix: process.env.CDN_URL || '',
	env: {
		CDN_URL: process.env.CDN_URL || '',
		AWS_REGION: process.env.AWS_REGION,
		API_URL: process.env.API_URL,
		API_KEY: process.env.API_KEY,
		STAGE: getStage()
	},
	webpack: (config) => {
		config.module.rules.push({
			test: /\.gql$/,
			exclude: /node_modules/,
			loader: 'graphql-tag/loader'
		})
		config.module.rules[2].oneOf[2].include.push(
			path.join(__dirname, '../packages')
		)
		return config
	}
}
