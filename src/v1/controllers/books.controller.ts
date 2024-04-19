import { NextFunction, Request, Response } from 'express';

import Book from '../models/book.model';

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
  postBook
};