import { Router } from 'express';

import isAdmin from '../../middlewares/isAdmin';
import upload from '../../middlewares/upload';
import booksController from '../controllers/books.controller';
import booksValidation from '../../validations/books.validation';

const router = Router();

router.get('/', booksController.getBooks);
router.get('/:id', booksController.getBook);
router.post('/', isAdmin, upload.array('image'), booksValidation.validateCreateBook, booksController.postBook);
router.put('/:id', isAdmin, upload.array('image'), booksValidation.validateCreateBook, booksController.updateBook);
router.delete('/:id', isAdmin, booksController.deleteBook);

export default router;