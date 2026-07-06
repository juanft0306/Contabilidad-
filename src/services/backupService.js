import { hacerBackup, restaurarBackup as restaurarBackupDB } from '../config/database.js';

export function crearBackup() {
    hacerBackup();
}

export function restaurarBackup() {
    restaurarBackupDB();
}
