import { cprint, limpiarPantalla, pausa } from '../utils/helpers.js';
import * as accountingService from '../services/accountingService.js';

export async function menuContabilidad(datos) {
    limpiarPantalla();
    cprint('--- CONTABILIDAD ---', '\x1b[36m', true);
    console.log('1. Balance de comprobación');
    console.log('2. Libro diario (últimas 5 transacciones)');
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
        const balance = accountingService.obtenerBalance(datos);
        console.log('\n--- BALANCE DE COMPROBACIÓN (USD) ---');
        console.log('Cuenta\t\tDebe\t\tHaber');
        for (const item of balance.lineas) {
            console.log(`${item.cuenta}\t\t${item.debe.toFixed(2)}\t\t${item.haber.toFixed(2)}`);
        }
        console.log(`Total Debe: ${balance.totalDebe.toFixed(2)}`);
        console.log(`Total Haber: ${balance.totalHaber.toFixed(2)}`);
        if (balance.totalDebe === balance.totalHaber) console.log('✅ El balance cuadra.');
        else console.log('⚠️ El balance NO cuadra.');
    } else if (opcion === '2') {
        const result = accountingService.obtenerLibroDiarioPaginado(datos, null, 0, 5);
        console.log('\n--- ÚLTIMAS TRANSACCIONES ---');
        for (const t of result.items) {
            console.log(`[${t.fecha}] ${t.tipo.toUpperCase()} - ${t.detalle} - $${t.monto_usd.toFixed(2)} (Bs ${t.monto_bs.toFixed(2)})`);
        }
    }
    await pausa();
}
