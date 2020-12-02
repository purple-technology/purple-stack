/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('@package/webpack')
const slsw = require('serverless-webpack')

const webpackConfig = config(slsw, __dirname)

module.exports = webpackConfig
