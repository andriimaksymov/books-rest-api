import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';

const genreSchema = Joi.object().keys({
  title: Joi.string().min(2).max(255).required()
    .messages({
      'string.min': 'Title must be at least {#limit} characters long.',
      'string.max': 'Title must be less than {#limit} characters long.',
      'any.required': 'Title is required.'
    }),
  slug: Joi.string().min(2).max(255).required()
    .messages({
      'string.min': 'Slug must be at least {#limit} characters long.',
      'string.max': 'Slug must be less than {#limit} characters long.',
      'any.required': 'Slug is required.'
    }),
});

const validateCreateGenre = async (req: Request, res: Response, next: NextFunction) => {
  const { error } = genreSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details?.[0]?.message });
  }
  next();
}

export default {
  validateCreateGenre
};