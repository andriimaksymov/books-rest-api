import { NextFunction, Request, Response } from 'express';

import { ExtendedRequest } from '../../middlewares/isAuth';
import CartModel from '../models/cart.model';
import BookModel from '../models/book.model';
import { ExtendedJwtPayload } from '../../types/jwt';

const getCart = async (req: Request, res: Response, next: NextFunction) => {
  const extendedReq = req as ExtendedRequest;
  const token = extendedReq.token as ExtendedJwtPayload;

  try {
    const cart = await CartModel.findOne({ userId: token.userId });

    res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
};

const postCart = async (req: Request, res: Response, next: NextFunction) => {
  const { cart_id, itemId, quantity = 1 } = req.body;

  try {
    const book = await BookModel.findOne({ _id: itemId });

    if (!book) {
      return res.status(404).json({ message: 'Book doesn\'t exist' });
    }

    let cart = await CartModel.findById(cart_id);
    if (cart) {
      const index = cart.items.findIndex((item) => item._id!.toString() === itemId);
      if (index > -1) {
        if (quantity > 0) {
          cart.items[index].quantity = quantity;
        } else {
          cart.items.splice(index, 1);
        }
      } else {
        cart.items.push({
          id: itemId,
          quantity,
          price: book.price,
        });
      }
      cart.total += book.price;
    } else {
      cart = new CartModel({
        items: [
          {
            id: itemId,
            quantity,
            price: book.price,
          },
        ],
        total: book.price,
      });
    }
    cart.quantity = cart.items.reduce((acc, cur) => acc + cur.quantity, 0);
    cart.total = cart.items.reduce((acc, cur) => acc + cur.quantity * cur.price, 0);
    await cart.save();
    res.status(201).json(cart);
  } catch (err) {
    next(err);
  }
};

const deleteCart = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const cart = await CartModel.findById(id);
    if (!cart) {
      return res.status(404).json({ message: 'Cart doesn\'t exist' });
    } else {
      await cart.deleteOne();
      res.status(200).json({
        id,
        message: 'Cart was successfully deleted!',
      });
    }
  } catch (err) {
    next(err);
  }
};

export default { getCart, postCart, deleteCart };
