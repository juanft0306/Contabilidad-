import express from 'express';
import * as clientController from '../controllers/clientController.js';

const router = express.Router();

router.get('/', clientController.listarClientes);
router.post('/', clientController.crearCliente);
router.delete('/cliente/:id', clientController.eliminarClienteController);
router.get('/proveedores', clientController.listarProveedores);
router.post('/proveedores', clientController.crearProveedor);
router.delete('/proveedor/:id', clientController.eliminarProveedorController);

export default router;
