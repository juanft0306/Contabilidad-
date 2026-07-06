import * as backupService from '../services/backupService.js';

/**
 * Controlador para crear una copia de seguridad.
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 */
export function hacerBackup(req, res) {
    try {
        backupService.crearBackup();
        res.status(200).json({ 
            success: true, 
            message: '✅ Copia de seguridad creada exitosamente' 
        });
    } catch (error) {
        console.error('Error al crear backup:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Error al crear la copia de seguridad' 
        });
    }
}

/**
 * Controlador para restaurar desde una copia de seguridad.
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 */
export function restaurarBackup(req, res) {
    try {
        backupService.restaurarBackup();
        res.status(200).json({ 
            success: true, 
            message: '✅ Datos restaurados desde copia de seguridad' 
        });
    } catch (error) {
        console.error('Error al restaurar backup:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Error al restaurar la copia de seguridad' 
        });
    }
}
