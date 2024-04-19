import { Router } from 'express';

import upload from '../../middlewares/upload';
import booksController from '../controllers/books.controller';
import booksValidation from '../../validations/books.validation';

const router = Router();

router.post('/', upload.array('image'), booksValidation.validateCreateBook, booksController.postBook);

export default router;