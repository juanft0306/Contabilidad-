import express from 'express';
import * as productController from '../controllers/productController.js';

const router = express.Router();

router.get('/', productController.listarProductos);
router.post('/', productController.agregarProducto);
router.delete('/:nombre', productController.eliminarProducto);

export default router;
