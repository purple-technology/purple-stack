module.exports = {
	globals: {
		__DEV__: true,
		'ts-jest': {
			tsconfig: 'tsconfig.test.json'
		}
	},
	preset: 'ts-jest',
	testEnvironment: 'node',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
	roots: ['<rootDir>/src'],
	transform: {
		'^.+\\.tsx?$': 'ts-jest'
	}
}
