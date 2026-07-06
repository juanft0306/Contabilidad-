import express from 'express';
import * as paymentController from '../controllers/paymentController.js';

const router = express.Router();

router.post('/registrar', paymentController.registrarPago);
router.get('/deuda/:clienteId', paymentController.obtenerDeudaCliente);
router.get('/cartera', paymentController.obtenerResumenCartera);

export default router;
