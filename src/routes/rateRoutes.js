import express from 'express';
import * as rateController from '../controllers/rateController.js';

const router = express.Router();

router.post('/actualizar', rateController.actualizarTasaInternet);

export default router;
