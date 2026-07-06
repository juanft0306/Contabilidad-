import express from 'express';
import * as accountingController from '../controllers/accountingController.js';

const router = express.Router();

router.get('/balance', accountingController.obtenerBalance);
router.get('/libro', accountingController.obtenerLibroDiario);

export default router;
