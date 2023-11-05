import { Joi, type schema } from 'express-validation'

import validate from './validate'

const registerUser: schema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    password: Joi.string().required()
  })
}

const getUser: schema = {
  query: Joi.object({
    email: Joi.string()
  })
}

export const userValidation = {
  registerUser: validate(registerUser),
  getUser: validate(getUser)
}
