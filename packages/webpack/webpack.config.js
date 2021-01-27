/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')

const getSecretConfigEnvs = (slsw) => {
	const { custom } = slsw.lib.serverless.service
	const secretConfigEnvs =
		custom && custom.secretConfigEnvs ? custom.secretConfigEnvs : {}

	return {
		'process.env.__SECRETS__': JSON.stringify(secretConfigEnvs)
	}
}

module.exports = (slsw, dirname) => {
	return {
		context: dirname,
		devtool: 'source-map',
		entry: slsw.lib.entries,
		externals: [
			nodeExternals({
				allowlist: [/^@package\/.*/]
			})
		],
		optimization: {
			minimize: false
		},
		mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
		module: {
			rules: [
				// all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
				{
					test: /\.tsx?$/,
					use: [
						{
							loader: 'ts-loader'
						}
					],
					exclude: /node_modules/
				}
			]
		},
		output: {
			filename: '[name].js',
			libraryTarget: 'commonjs',
			path: path.join(dirname, '.webpack')
		},
		resolve: {
			extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
		},
		target: 'node',
		plugins: [
			new webpack.IgnorePlugin(/^pg-native$/),
			new webpack.DefinePlugin({ ...getSecretConfigEnvs(slsw) })
		]
	}
}
