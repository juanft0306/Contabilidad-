import express from 'express';
import multer from 'multer';
import * as backupController from '../controllers/backupController.js';

const router = express.Router();

// Configurar multer para almacenar en memoria (no en disco)
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // Límite: 5MB
});

// Rutas para backup interno (JSON)
router.post('/crear', backupController.hacerBackup);
router.post('/restaurar', backupController.restaurarBackup);

// Rutas para exportar/importar Excel
router.get('/exportar-excel', backupController.exportarExcel);
router.post('/importar-excel', upload.single('archivo'), backupController.importarExcel);

export default router;
