import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import util from 'util';

import Token from '../models/token.model';
import User from '../models/user.model';
import { verifyToken } from '../../utils/jwt';
import sendEmail from '../../utils/sendEmail';

const readFileAsync = util.promisify(fs.readFile);

const postSignUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    const user = new User({
      email: req.body.email,
      password
    });
    await user.save();
    res.status(200).json({ message: 'ok' });
  } catch (e) {
    next(e);
  }
};

const postLogin = async (req: Request, res: Response, next: NextFunction) => {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: '' });
  }

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
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );
    return res.status(200).json({ token });
  } catch (e) {
    next(e);
  }
};

const postForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User does not exist.' });
    } else {
      const token = await Token.findOne({ user_id: user._id });
      if (token) await token.deleteOne();
      const newToken = jwt.sign(
        {
          user_id: user._id,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' },
      );
      await new Token({
        user_id: user._id,
        token: newToken,
        created_at: Date.now(),
      }).save();

      const template: string = await readFileAsync('./views/reset-password.html', 'utf8');
      const link: string = `${process.env.BASE_URL}/reset-password/token=${newToken}`;
      const html = template.replace('[reset_password_link]', link);
      await sendEmail(email, 'Password reset', html);
      return res.status(200).json({ link });
    }
  } catch (e) {
    next(e);
  }
};

const postResetPassword = async (req: Request, res: Response, next: NextFunction) => {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: '' });
  }
  try {
    verifyToken(req.body.token, process.env.JWT_SECRET)
      .then(async (decoded) => {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);
        await User.updateOne({ _id: decoded.user_id }, { $set: { password } }, { new: true });
        await Token.findOne({ user_id: decoded.user_id }).deleteOne();
        return res.status(200).json({ message: 'Password was successfully updated' });
      })
      .catch(() => {
        return res.status(400).json({ message: 'Token is invalid.' });
      });
  } catch (e) {
    next(e);
  }
};

export default {
  postSignUp,
  postLogin,
  postForgotPassword,
  postResetPassword
};