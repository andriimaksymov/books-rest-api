import { Router } from 'express';

import upload from '../../storage';
import cartController from '../controllers/cart.controller';
import cartValidation from '../../validations/cart.validation';

const router = Router();

router.get('/:id', cartController.getCart);
router.post('/', upload.none(), cartValidation.validateCreateGenre, cartController.postCart);
router.delete('/:id', cartController.deleteCart);

export default router;
