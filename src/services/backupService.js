import { hacerBackup, restaurarBackup } from '../config/database.js';

export function crearBackup() {
    hacerBackup();
}

export function restaurarBackup() {
    restaurarBackup();
}
