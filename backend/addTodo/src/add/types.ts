import * as Joi from '@hapi/joi'

const schema = Joi.object()
	.keys({
		text: Joi.string().required()
	})
	.required()

export const validateSchema = (input: Input): void => {
	const validationResult = schema.validate(input, {
		stripUnknown: true,
		abortEarly: false
	})
	if (validationResult.error) {
		throw new Error(validationResult.error.message)
	}
}

export interface Input {
	text: string
}

export type Output = void
