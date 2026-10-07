import express, { Router } from 'express';
import { loginController, sectorChurchesController, sectorLoginController } from './auth.controller';

const router: Router = express.Router();

router.post('/login', loginController);
router.get('/sector-churches', sectorChurchesController);
router.post('/sector-login', sectorLoginController);

export default router;
