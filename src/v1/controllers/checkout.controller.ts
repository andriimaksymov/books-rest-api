import { NextFunction, Request, Response } from 'express';
import Stripe from 'stripe';

import CartModel from '../models/cart.model';
import OrderModel from '../models/order.model';

const postCheckout = async (req: Request, res: Response, next: NextFunction) => {
  const { cart_id, user_id } = req.body;

  if (!process.env.STRIPE_TEST_KEY) {
    return res.status(500).json({ message: 'Servet error' })
  }

  const stripe = new Stripe(process.env.STRIPE_TEST_KEY, {
    apiVersion: '2024-04-10'
  });

  try {
    const cart = await CartModel.findById(cart_id);
    if (cart) {
      const order = new OrderModel({
        items: cart.items,
        total: cart.total,
        quantity: cart.quantity,
        user: user_id,
      });
      await order.save();
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: cart.items.map((item) => ({
          name: '',
          description: '',
          amount: 0,
          currency: 'usd',
          quantity: 0
        })),
        mode: 'payment',
        success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel',
      });
      await cart.deleteOne();
      return res.status(201).json({
        order,
        sessionId: session.id
      });
    } else {
      return res.status(404).json({ message: 'Order doesn\'t exist', });
    }
  } catch (err) {
    next(err);
  }
};

export default { postCheckout };
