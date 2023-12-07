import { Joi, type schema } from 'express-validation'

import validate from './validate'

const createPost: schema = {
  body: Joi.object({
    text: Joi.string().required(),
    files: Joi.array(),
    access: Joi.string()
  })
}
const reactPost: schema = {
  body: Joi.object({
    reactId: Joi.number().required()
  })
}

export const postValidation = {
  createPost: validate(createPost),
  reactPost: validate(reactPost)
}
