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

// Cargar datos
const datos = cargarDatos();

// Si se pasa --cli, ejecutar modo consola
const args = process.argv.slice(2);
if (args.includes('--cli')) {
    await iniciarCLI(datos);
    process.exit(0);
}

// --- MODO WEB ---
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Hacer los datos accesibles en toda la aplicación
app.locals.datos = datos;

// Configurar EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Pasar datos y modo prueba a las vistas
app.use((req, res, next) => {
    res.locals.datos = datos;
    res.locals.modoPrueba = MODO_PRUEBA;
    next();
});

// ✅ También pasar datos a req.app.locals para los controladores
app.use((req, res, next) => {
    req.app.locals.datos = datos;
    next();
});

// Rutas
app.use('/', routes);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🌐 Servidor web en http://localhost:${PORT}`);
    console.log(`📁 Modo prueba: ${MODO_PRUEBA ? 'ACTIVADO' : 'DESACTIVADO'}`);
});
