module.exports = {
	extends: [
		'plugin:react/recommended',
		'plugin:@microsoft/eslint-plugin-sdl/node',
		'plugin:@microsoft/eslint-plugin-sdl/common',
		'plugin:@microsoft/eslint-plugin-sdl/react',
		'plugin:security/recommended-legacy'
	],
	parserOptions: {
		ecmaVersion: 13,
		sourceType: 'module'
	},
	settings: {
		react: {
			version: '18.2'
		}
	},
	plugins: [
		'prettier',
		'simple-import-sort',
		'react-hooks',
		'@microsoft/eslint-plugin-sdl'
	],
	rules: {
		'prettier/prettier': 'error',
		'react-hooks/exhaustive-deps': 'warn',
		'react-hooks/rules-of-hooks': 'error',
		'react/prop-types': ['off'],
		'simple-import-sort/exports': 'error',
		'simple-import-sort/imports': 'error',
		'react/react-in-jsx-scope': 'off'
	},
	overrides: [
		{
			files: ['*.ts', '*.tsx'],
			parser: '@typescript-eslint/parser',
			extends: ['plugin:@microsoft/eslint-plugin-sdl/typescript'],
			parserOptions: {
				project: [
					'./tsconfig.json',
					'./services/**/tsconfig.json',
					'./packages/**/tsconfig.json'
				]
			},
			plugins: ['@typescript-eslint'],
			rules: {
				'@typescript-eslint/ban-ts-comment': [
					'error',
					{
						'ts-expect-error': 'allow-with-description',
						'ts-ignore': 'allow-with-description',
						'ts-nocheck': true,
						'ts-check': false
					}
				],
				'@typescript-eslint/ban-types': ['off'],
				'@typescript-eslint/explicit-function-return-type': 'error',
				'@typescript-eslint/no-explicit-any': ['warn'],
				'@typescript-eslint/no-unused-vars': 'error',
				'@typescript-eslint/no-use-before-define': ['warn'],
				'@typescript-eslint/no-non-null-assertion': ['warn'],
				'@typescript-eslint/consistent-type-imports': 'error'
			}
		}
	]
}
