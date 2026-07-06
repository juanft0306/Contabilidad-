import { crearBackup, restaurarBackup } from '../services/backupService.js';

export function hacerBackup(req, res) {
    try {
        crearBackup();
        res.json({ message: 'Backup creado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export function restaurarBackup(req, res) {
    try {
        restaurarBackup();
        res.json({ message: 'Backup restaurado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
