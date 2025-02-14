import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

const userEndpointDesc = 'This is how to add swagger description for this endpoint'

export const requestSchema = (translateFn: any) => Joi.object({
	headers: Joi.object().keys({
		language: Joi.string().valid('sk', 'en')
	}).options({ allowUnknown: true }).example(translateFn('example translate')),
	params: Joi.object({
		userID: Joi.number()
	}),
	query: Joi.object({
		search: Joi.string().required()
	}),
	body: Joi.object({
		name: Joi.string().required()
	})
}).description(userEndpointDesc)

export const responseSchema = Joi.object({
	user: Joi.object({
		id: Joi.number(),
		name: Joi.string(),
		surname: Joi.string()
	}),
})

export const errorResponseSchemas = [
	Joi.object({
		messages: Joi.array().items(Joi.object({
			type: Joi.string().required(),
			message: Joi.string().required().example('Not found')
			})
		)
	}).description('404'),
	Joi.object({
		messages: Joi.array().items(Joi.object({
				type: Joi.string().required(),
				message: Joi.string().required().example('Conflict')
			})
		)
	}).description('409')
]

export const businessLogic = (req: Request, res: Response, next: NextFunction) => {
	try {
		const { userID } = req.params
		return res.json({
			user: {
				id: userID,
				name: 'John',
				surname: 'Snow'
			}
		})
	} catch (e) {
		return next(e)
	}
}
