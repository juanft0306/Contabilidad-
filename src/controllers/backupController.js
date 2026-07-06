import * as backupService from '../services/backupService.js';
import * as excelService from '../services/excelService.js';
import { guardarDatos } from '../config/database.js';

/**
 * Crear una copia de seguridad en JSON (backup interno)
 */
export function hacerBackup(req, res) {
    try {
        backupService.crearBackup();
        res.status(200).json({ 
            success: true, 
            message: '✅ Copia de seguridad JSON creada exitosamente' 
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
 * Restaurar desde copia de seguridad JSON
 */
export function restaurarBackup(req, res) {
    try {
        backupService.restaurarBackup();
        res.status(200).json({ 
            success: true, 
            message: '✅ Datos restaurados desde backup JSON' 
        });
    } catch (error) {
        console.error('Error al restaurar backup:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Error al restaurar la copia de seguridad' 
        });
    }
}

/**
 * Exportar todos los datos a un archivo Excel (.xlsx)
 */
export function exportarExcel(req, res) {
    try {
        const datos = req.app.locals.datos;
        const buffer = excelService.exportarDatosAExcel(datos);
        
        // Configurar cabeceras para descarga
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=backup_completo.xlsx');
        res.setHeader('Content-Length', buffer.length);
        
        res.send(buffer);
    } catch (error) {
        console.error('Error al exportar Excel:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Error al exportar a Excel' 
        });
    }
}

/**
 * Importar datos desde un archivo Excel (.xlsx)
 */
export function importarExcel(req, res) {
    try {
        // Verificar que se haya subido un archivo
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                error: 'No se subió ningún archivo. Selecciona un archivo .xlsx' 
            });
        }

        // Validar extensión
        const ext = req.file.originalname.split('.').pop().toLowerCase();
        if (!['xlsx', 'xls'].includes(ext)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Formato no válido. Solo se permiten archivos .xlsx o .xls' 
            });
        }

        const buffer = req.file.buffer;
        const nuevosDatos = excelService.importarDatosDesdeExcel(buffer);
        
        // Sobrescribir los datos actuales
        const datos = req.app.locals.datos;
        Object.assign(datos, nuevosDatos);
        guardarDatos(datos);
        
        res.status(200).json({ 
            success: true, 
            message: '✅ Datos importados correctamente desde Excel' 
        });
    } catch (error) {
        console.error('Error al importar Excel:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Error al importar desde Excel' 
        });
    }
            }
