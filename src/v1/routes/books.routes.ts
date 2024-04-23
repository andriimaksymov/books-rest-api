import { Router } from 'express';

import isAdmin from '../../middlewares/isAdmin';
import booksController from '../controllers/books.controller';
import booksValidation from '../../validations/books.validation';
import upload from '../../storage';

const router = Router();

router.get('/', booksController.getBooks);
router.get('/:id', booksController.getBook);
router.post('/', isAdmin, upload.array('image'), booksValidation.validateCreateBook, booksController.createBook);
router.put('/:id', isAdmin, upload.array('image'), booksValidation.validateCreateBook, booksController.updateBook);
router.delete('/:id', isAdmin, booksController.deleteBook);

export default router;