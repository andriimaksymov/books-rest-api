import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';

import User from '../models/user.model';

const postSignUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(req.body.password, salt)
    const user = await new User({
      email: req.body.email,
      password
    });
    await user.save();
    res.status(200).json({
      message: 'ok'
    });
  } catch (e) {
    console.log(123, e);
    next(e);
  }
};

export default {
  postSignUp
};