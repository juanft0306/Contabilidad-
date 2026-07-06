import dotenv from 'dotenv';
dotenv.config();

export const ARCHIVO_DATOS = 'data/datos.json';
export const ARCHIVO_BACKUP = 'data/datos_backup.json';
export const MODO_PRUEBA = process.env.MODO_PRUEBA === 'true';

export const COLORES = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
};

export const CUENTAS_DEFAULT = ['Caja', 'Ventas', 'Inventario', 'Capital'];
export const CATEGORIA_DEFAULT = 'General';
