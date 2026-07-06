import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/verify', authController.verificarAcceso);
router.post('/change', authController.cambiarPassword);

export default router;
