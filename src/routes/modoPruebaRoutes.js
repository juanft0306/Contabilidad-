import express from 'express';
import * as modoPruebaController from '../controllers/modoPruebaController.js';

const router = express.Router();

router.post('/activar', modoPruebaController.activarModoPrueba);
router.post('/desactivar', modoPruebaController.desactivarModoPrueba);
router.get('/estado', modoPruebaController.estadoModoPrueba);

export default router;
