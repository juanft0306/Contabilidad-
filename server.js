#!/usr/bin/env node

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { cargarDatos } from './src/config/database.js';
import { iniciarCLI } from './src/cli/cliMenu.js';
import { MODO_PRUEBA } from './src/config/constants.js';
import routes from './src/routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datos = cargarDatos();

const args = process.argv.slice(2);
if (args.includes('--cli')) {
    await iniciarCLI(datos);
    process.exit(0);
}

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.datos = datos;
    res.locals.modoPrueba = MODO_PRUEBA;
    next();
});

app.use('/', routes);

app.listen(PORT, () => {
    console.log(`🌐 Servidor web en http://localhost:${PORT}`);
    console.log(`📁 Modo prueba: ${MODO_PRUEBA ? 'ACTIVADO' : 'DESACTIVADO'}`);
});
