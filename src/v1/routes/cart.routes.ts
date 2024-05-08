import { Router } from 'express';

import upload from '../../storage';
import cartController from '../controllers/cart.controller';
import cartValidation from '../../validations/cart.validation';
import isAuth from '../../middlewares/isAuth';

const router = Router();

router.get('/', isAuth, cartController.getCart);
router.post('/', isAuth, upload.none(), cartValidation.validateCreateGenre, cartController.postCart);
router.delete('/', isAuth, cartController.deleteCart);

export default router;
