const fs = require('fs')
const path = require('path')
const split = require('split-camelcase')

const rootPath = path.join(__dirname, '../')

const graphqlPath = path.join(rootPath, 'src', 'graphql')

const types = fs.readdirSync(graphqlPath)

const shorten = (size, str) =>
	split(str).map((s, _, items) =>
		s.slice(0, size / items.length)
	).join('')

const fieldName = file => file.replace('.ts', '')
const functionName = (type, field) => `_gql-${shorten(6, type)}-${shorten(15, field)}`.toLowerCase()
const dsName = (type, field) => `${type}_${field}`

const filesOnly = type => field =>
	!fs.statSync(path.join(graphqlPath, type, field)).isDirectory()

const typesFields = types.reduce(
	(acc, type) => [
		...acc,
		...fs
			.readdirSync(path.join(graphqlPath, type))
			.filter(filesOnly(type))
			.map(fieldName)
			.map(field => ({
				type,
				field
			}))
	],
	[]
)

module.exports.mappingTemplates = () =>
	typesFields.map(({ type, field }) => ({
		dataSource: dsName(type, field),
		type,
		field,
		request: type === 'Mutation' ? 'request-single.vtl' : 'request-batch.vtl',
		response: 'response.vtl'
	}))

module.exports.dataSources = () =>
	typesFields.map(({ type, field }) => ({
		type: 'AWS_LAMBDA',
		name: dsName(type, field),
		config: {
			functionName: functionName(type, field)
		}
	}))

module.exports.functions = () =>
	typesFields.reduce(
		(acc, { type, field }) => ({
			...acc,
			[functionName(type, field)]: {
				handler: `${path.relative(rootPath, path.join(graphqlPath, type, field))}.handler`,
				alarms: [
					{
						name: 'functionErrors',
						description: `\${self:service} - ${type} - ${field} - Lambda Error`
					}
				],
				tags: {
					project: '${self:custom.settings.common.projectName}',
					description: `AppSync resolver of ${type}/${field} in \${self:custom.settings.common.projectName}`
				}
			}
		}),
		{}
	)
