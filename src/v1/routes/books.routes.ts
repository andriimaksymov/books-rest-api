import { Router } from 'express';

import isAdmin from '../../middlewares/isAdmin';
import upload from '../../middlewares/upload';
import booksController from '../controllers/books.controller';
import booksValidation from '../../validations/books.validation';

const router = Router();

router.get('/', booksController.getBooks);
router.post('/', isAdmin, upload.array('image'), booksValidation.validateCreateBook, booksController.postBook);

export default router;