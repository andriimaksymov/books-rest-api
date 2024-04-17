import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';

import User from '../v1/models/user.model';

const PASSWORD_REGEX = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{6,})');

const signupSchema = Joi.object().keys({
  email: Joi.string().email().required()
    .messages({
      'string.email': 'Please enter a valid email address.',
      'any.required': 'Email is required.'
    }),
  password: Joi.string().pattern(PASSWORD_REGEX).required()
    .messages({
      'string.pattern.base': 'Password must be at least 6 characters long. Make sure it includes a mix of uppercase and lowercase letters, numbers, and symbols.',
      'any.required': 'Password is required.'
    }),
});

const forgotPasswordSchema = Joi.object().keys({
  email: Joi.string().email().required()
    .messages({
      'string.email': 'Please enter a valid email address.',
      'any.required': 'Email is required.'
    }),
});

const resetPasswordSchema = Joi.object().keys({
  password: Joi.string().pattern(PASSWORD_REGEX).required()
    .messages({
      'string.pattern.base': 'Password must be at least 6 characters long. Make sure it includes a mix of uppercase and lowercase letters, numbers, and symbols.',
      'any.required': 'Password is required.'
    }),
  token: Joi.string().required()
    .messages({
      'any.required': 'Token is required.'
    }),
});

const validateSignup = async (req: Request, res: Response, next: NextFunction) => {
  const { error } = signupSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details?.[0]?.message });
  }

  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: 'User already exists. Please sign in' });
  }
  next();
};

const validateLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { error } = signupSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details?.[0]?.message });
  }
  next();
};

const validateForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { error } = forgotPasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details?.[0]?.message });
  }
  next();
}

const validateResetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { error } = resetPasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details?.[0]?.message });
  }
  next();
}

export default {
  validateSignup,
  validateLogin,
  validateForgotPassword,
  validateResetPassword
};