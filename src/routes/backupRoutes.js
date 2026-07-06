import express from 'express';
import * as backupController from '../controllers/backupController.js';

const router = express.Router();

router.post('/crear', backupController.hacerBackup);
router.post('/restaurar', backupController.restaurarBackup);

export default router;
