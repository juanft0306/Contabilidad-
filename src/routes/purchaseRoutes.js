import express from 'express';
import * as purchaseController from '../controllers/purchaseController.js';

const router = express.Router();

router.post('/', purchaseController.registrarCompra);

export default router;
