import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';

const cartSchema = Joi.object().keys({
  quantity: Joi.number().min(0).required()
    .messages({
      'number.min': 'Quantity must be at least {#limit} characters long.',
      'any.required': 'Quantity is required.'
    }),
  item_id: Joi.string().required(),
  cart_id: Joi.string()
});

const validateCreateGenre = async (req: Request, res: Response, next: NextFunction) => {
  const { error } = cartSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details?.[0]?.message });
  }
  next();
}

export default {
  validateCreateGenre
};