import express, { Router } from 'express';
import { loginController } from './auth.controller';

const router: Router = express.Router();

router.post('/login', loginController);

export default router;
