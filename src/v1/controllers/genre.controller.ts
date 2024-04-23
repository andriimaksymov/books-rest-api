import { NextFunction, Request, Response } from 'express';

import Genre from '../models/genre.model';

const getGenres = async (req: Request, res: Response, next: NextFunction) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const genres = await Genre.find()
      .limit(+limit)
      .skip((+page - 1) * +limit)
      .sort({ createdAt: -1 });

    const total = await Genre.countDocuments();
    res.status(200).json({
      items: genres,
      total,
      limit,
      page,
    });
  } catch (err) {
    next(err);
  }
};

const getGenre = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const genre = await Genre.findById(id);
    res.status(200).json(genre);
  } catch (err) {
    next(err);
  }
};

const createGenre = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const genre = await new Genre(req.body).save();
    res.status(201).json(genre);
  } catch (err) {
    next(err);
  }
};

const updateGenre = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await Genre.findByIdAndUpdate(id, req.body);
    res.status(200).json({ message: 'The genre was successfully updated' });
  } catch (err) {
    next(err);
  }
};

const deleteGenre = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await Genre.findByIdAndDelete(id);
    res.status(200).json({ message: 'The genre was successfully deleted' });
  } catch (err) {
    next(err);
  }
};

export default {
  getGenre,
  getGenres,
  createGenre,
  updateGenre,
  deleteGenre
};