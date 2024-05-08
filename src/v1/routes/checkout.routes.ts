import { Router } from 'express';

import upload from '../../storage';
import checkoutController from '../controllers/checkout.controller';

const router = Router();

router.post('/', upload.none(), checkoutController.postCheckout);

export default router;
