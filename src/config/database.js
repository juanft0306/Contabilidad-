import fs from 'fs';
import { ARCHIVO_DATOS, ARCHIVO_BACKUP, MODO_PRUEBA } from './constants.js';
import { inicializarDatos } from '../models/dataModel.js';

export function cargarDatos() {
    if (!fs.existsSync(ARCHIVO_DATOS)) {
        const estructura = inicializarDatos();
        guardarDatos(estructura);
        return estructura;
    }
    const contenido = fs.readFileSync(ARCHIVO_DATOS, 'utf-8');
    return JSON.parse(contenido);
}

export function guardarDatos(datos) {
    if (MODO_PRUEBA) {
        console.log('🔹 (Modo prueba) Los cambios no se guardan en disco.');
        return;
    }
    fs.writeFileSync(ARCHIVO_DATOS, JSON.stringify(datos, null, 4), 'utf-8');
}

export function hacerBackup() {
    if (fs.existsSync(ARCHIVO_DATOS)) {
        fs.copyFileSync(ARCHIVO_DATOS, ARCHIVO_BACKUP);
        console.log('✅ Copia de seguridad creada.');
    }
}

export function restaurarBackup() {
    if (fs.existsSync(ARCHIVO_BACKUP)) {
        fs.copyFileSync(ARCHIVO_BACKUP, ARCHIVO_DATOS);
        console.log('✅ Datos restaurados desde backup.');
    } else {
        console.log('⚠️ No existe archivo de backup.');
    }
}
