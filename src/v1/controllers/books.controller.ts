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

const getBook = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id);
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({
        message: 'Book you are looking for does not exist',
      });
    }
  } catch (err) {
    next(err);
  }
};

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await new Book({
      ...req.body,
      images: Array.isArray(req.files) ? req.files.map((file) => ({
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

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const data = {
      ...req.body,
    };
    const book = await Book.findByIdAndUpdate(id, data, {
      returnOriginal: false,
    });
    if (!book) {
      return res.status(404).json({ message: 'Book doesn\'t exist', });
    } else {
      res.status(200).json(book);
    }
  } catch (err) {
    next(err);
  }
};

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book doesn\'t exist.' });
    } else {
      await book.deleteOne();
      return res.status(200).json({
        id,
        message: 'Book was successfully deleted!',
      });
    }
  } catch (err) {
    next(err);
  }
};

export default {
  getBook,
  getBooks,
  createBook,
  updateBook,
  deleteBook,
};