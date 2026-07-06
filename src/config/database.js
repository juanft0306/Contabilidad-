import fs from 'fs';
import path from 'path';
import { ARCHIVO_DATOS, ARCHIVO_BACKUP, MODO_PRUEBA } from './constants.js';
import { inicializarDatos } from '../models/dataModel.js';

// Asegurar que el directorio data existe al cargar el módulo
const DATA_DIR = path.dirname(ARCHIVO_DATOS);
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

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
    // Asegurar que el directorio existe antes de escribir
    const dir = path.dirname(ARCHIVO_DATOS);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(ARCHIVO_DATOS, JSON.stringify(datos, null, 4), 'utf-8');
}

export function hacerBackup() {
    if (fs.existsSync(ARCHIVO_DATOS)) {
        const dir = path.dirname(ARCHIVO_BACKUP);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.copyFileSync(ARCHIVO_DATOS, ARCHIVO_BACKUP);
        console.log('✅ Copia de seguridad creada.');
    } else {
        console.log('⚠️ No hay datos para hacer backup.');
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
