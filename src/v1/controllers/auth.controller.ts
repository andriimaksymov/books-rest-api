import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/user.model';

const postSignUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
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

const postLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    const isPasswordCorrect = user ? await bcrypt.compare(password, user.password) : false;
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ message: 'Email or password is not correct.' });
    }
    const token = jwt.sign(
      {
        email,
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' },
    );
    return res.status(200).json({ token });
  } catch (e) {
    next(e);
  }
};

export default {
  postSignUp,
  postLogin
};