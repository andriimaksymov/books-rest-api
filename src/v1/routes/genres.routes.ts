import { Router } from 'express';

import isAdmin from '../../middlewares/isAdmin';
import genreController from '../controllers/genre.controller';
import genresValidation from '../../validations/genres.validation';
import upload from '../../storage';

const router = Router();

router.get('/', genreController.getGenres);
router.get('/:id', genreController.getGenre);
router.post('/', upload.none(), isAdmin, genresValidation.validateCreateGenre, genreController.createGenre);
router.put('/:id', upload.none(), isAdmin, genresValidation.validateCreateGenre, genreController.updateGenre);
router.delete('/:id', isAdmin, genreController.deleteGenre);

export default router;