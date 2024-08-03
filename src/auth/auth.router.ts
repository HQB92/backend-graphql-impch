import express from 'express';
import {loginController} from './auth.controller';

const router = express.Router();

router.post('/login', loginController);

export default router;
