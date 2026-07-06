import { cprint, limpiarPantalla, pausa, leerNumero, confirmar } from '../utils/helpers.js';
import { guardarDatos, hacerBackup, restaurarBackup } from '../config/database.js';
import * as authService from '../services/authService.js';
import * as rateService from '../services/rateService.js';

export async function menuConfiguracion(datos) {
    limpiarPantalla();
    cprint('--- CONFIGURACIÓN ---', '\x1b[35m', true);
    console.log('1. Ver tasas de cambio');
    console.log('2. Actualizar tasa desde internet');
    console.log('3. Establecer contraseña');
    console.log('4. Crear backup');
    console.log('5. Restaurar backup');
    console.log('6. Volver');
    const opcion = await new Promise(resolve => {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        readline.question('Selecciona: ', respuesta => {
            readline.close();
            resolve(respuesta.trim());
        });
    });
    if (opcion === '1') {
        for (const [nombre, info] of Object.entries(datos.tasas)) {
            console.log(`${nombre}: ${info.valor} Bs/USD (última act: ${info.ultima_actualizacion})`);
        }
        await pausa();
    } else if (opcion === '2') {
        const result = await rateService.obtenerTasaInternet();
        if (result) {
            const fecha = new Date().toISOString().replace('T', ' ').slice(0, 19);
            datos.tasas['BCV'] = { valor: result.tasa, ultima_actualizacion: fecha };
            datos.historico_tasas.push({ nombre: 'BCV', valor: result.tasa, fecha });
            guardarDatos(datos);
            console.log(`✅ Tasa actualizada: ${result.tasa} Bs/USD`);
        } else {
            console.log('❌ No se pudo obtener la tasa.');
        }
        await pausa();
    } else if (opcion === '3') {
        const nueva = await new Promise(resolve => {
            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });
            readline.question('Nueva contraseña (vacío para quitar): ', respuesta => {
                readline.close();
                resolve(respuesta.trim());
            });
        });
        authService.establecerPassword(datos, nueva || null);
        console.log('✅ Contraseña actualizada.');
        await pausa();
    } else if (opcion === '4') {
        hacerBackup();
        await pausa();
    } else if (opcion === '5') {
        if (await confirmar('¿Restaurar backup? Se perderán cambios.')) {
            restaurarBackup();
            console.log('✅ Backup restaurado. Reinicia la aplicación.');
        }
        await pausa();
    }
}
