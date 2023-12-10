import { Joi, type schema } from 'express-validation'

import validate from './validate'

const createStory: schema = {
  body: Joi.object({
    mutedOriginal: Joi.boolean().required(),
    song: Joi.object(),
    fileId: Joi.object().required()
  })
}

export const postValidation = {
  createStory: validate(createStory)
}
