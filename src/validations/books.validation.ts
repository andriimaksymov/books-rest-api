import Joi from 'joi';
import { Types } from 'mongoose';
import { NextFunction, Request, Response } from 'express';

import Genre from '../v1/models/genre.model';

const genreIdSchema = Joi.string().required().custom((value, helper) => {
  return Genre.findById(value)
    .then(genre => {
      if (!genre) {
        return helper.error('Invalid genre ID');
      }
      return value;
    });
});

const bookSchema = Joi.object().keys({
  title: Joi.string().min(2).max(255).required()
    .messages({
      'string.min': 'Title must be at least {#limit} characters long.',
      'string.max': 'Title must be less than {#limit} characters long.',
      'any.required': 'Title is required.'
    }),
  author: Joi.string().min(2).max(255).required()
    .messages({
      'string.min': 'Author must be at least {#limit} characters long.',
      'string.max': 'Author must be less than {#limit} characters long.',
      'any.required': 'Author is required.'
    }),
  year: Joi.number().min(1800).max(new Date().getFullYear())
    .messages({
      'string.min': 'Year must be at least {#limit}.',
      'string.max': 'Year must not exceed {#limit}.',
    }),
  description: Joi.string().min(80).max(5000)
    .messages({
      'string.min': 'Description must be at least {#limit} characters long.',
      'string.max': 'Description must be less than {#limit} characters long.',
    }),
  genres: Joi.alternatives().try(Joi.array().items(genreIdSchema), genreIdSchema),
  price: Joi.number().min(0).required()
    .messages({
      'number.base': 'Price must be a number.',
      'number.min': 'Price must be greater than zero.',
      'any.required': 'Product price is required.'
    })
});

const validateCreateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { error } = bookSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details?.[0]?.message });
  }
  const { genres } = req.body;
  try {
    Array.isArray(genres)
      ? await Promise.all(req.body.genres.map((id: Types.ObjectId) => Genre.findById(id)))
      : await Genre.findById(genres);
  } catch (err) {
    return res.status(400).json({ message: 'Please use correct genre ids' });
  }
  next();
};

export default {
  validateCreateBook
};