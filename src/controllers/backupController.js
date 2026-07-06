import * as backupService from '../services/backupService.js';

export function hacerBackup(req, res) {
    try {
        backupService.crearBackup();
        res.status(200).json({ message: 'Backup creado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export function restaurarBackup(req, res) {
    try {
        backupService.restaurarBackup();
        res.status(200).json({ message: 'Backup restaurado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
