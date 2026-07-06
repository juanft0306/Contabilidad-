#!/usr/bin/env node

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { cargarDatos } from './src/config/database.js';
import { iniciarCLI } from './src/cli/cliMenu.js';
import { MODO_PRUEBA } from './src/config/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar datos
const datos = cargarDatos();

// Si se pasa --cli, ejecutar modo consola
const args = process.argv.slice(2);
if (args.includes('--cli')) {
    await iniciarCLI(datos);
    process.exit(0);
}

// --- MODO WEB (por ahora solo un mensaje) ---
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('🚀 Servidor funcionando. Modo web en construcción.');
});

app.listen(PORT, () => {
    console.log(`🌐 Servidor en http://localhost:${PORT}`);
});
