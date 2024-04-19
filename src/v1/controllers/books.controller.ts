import { NextFunction, Request, Response } from 'express';

import Book from '../models/book.model';

const getBooks = async (req: Request, res: Response, next: NextFunction) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const books = await Book.find()
      .limit(+limit)
      .skip((+page - 1) * +limit)
      .sort({ createdAt: -1 });
    const total = await Book.countDocuments();
    res.status(200).json({
      items: books,
      total,
      limit,
      page,
    });
  } catch (err) {
    next(err);
  }
};

const postBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await new Book({
      ...req.body,
      images: Array.isArray(req.files) ? req.files?.map((file) => ({
        filename: file.filename,
        path: file.path
      })) : []
    });
    await book.save();
    res.status(200).json(book);
  } catch (e) {
    next(e);
  }
};

export default {
  postBook,
  getBooks
};