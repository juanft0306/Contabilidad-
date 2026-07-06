import { cprint, limpiarPantalla, pausa, leerNumero, leerEntero } from '../utils/helpers.js';
import * as purchaseService from '../services/purchaseService.js';

export async function menuCompras(datos) {
    limpiarPantalla();
    cprint('--- REGISTRAR COMPRA ---', '\x1b[31m', true);
    const proveedorId = await new Promise(resolve => {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        readline.question('ID del proveedor: ', respuesta => {
            readline.close();
            resolve(respuesta.trim() || null);
        });
    });
    const productoNombre = await new Promise(resolve => {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        readline.question('Nombre del producto: ', respuesta => {
            readline.close();
            resolve(respuesta.trim().toLowerCase());
        });
    });
    const cantidad = await leerEntero('Cantidad: ');
    if (cantidad === null) return;
    const precio = await leerNumero('Precio unitario USD: ', parseFloat);
    if (precio === null) return;
    try {
        const result = purchaseService.registrarCompra(datos, proveedorId, productoNombre, cantidad, precio, null);
        console.log(`✅ Compra registrada. Total: $${result.monto_usd.toFixed(2)} (Bs ${result.monto_bs.toFixed(2)})`);
    } catch (error) {
        console.log(`❌ ${error.message}`);
    }
    await pausa();
}
