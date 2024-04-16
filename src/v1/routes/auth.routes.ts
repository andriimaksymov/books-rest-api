import { Router } from 'express';

import authController from '../controllers/auth.controller';
import upload from '../../middlewares/upload';
import authValidation from '../../validations/auth.validation';

const router = Router();

router.post('/sign-up', upload.none(), authValidation.validateSignup, authController.postSignUp)

export default router;