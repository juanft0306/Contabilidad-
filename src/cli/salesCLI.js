import { cprint, limpiarPantalla, pausa, leerNumero, leerEntero } from '../utils/helpers.js';
import * as salesService from '../services/salesService.js';

export async function menuVentas(datos) {
    limpiarPantalla();
    cprint('--- REGISTRAR VENTA ---', '\x1b[32m', true);
    const clienteId = await new Promise(resolve => {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        readline.question('ID del cliente (Enter para consumidor final): ', respuesta => {
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
        const result = salesService.registrarVenta(datos, clienteId, productoNombre, cantidad, precio, null);
        console.log(`✅ Venta registrada. Factura ${result.factura.numero}`);
        console.log(`   Total: $${result.transaccion.monto_usd.toFixed(2)} (Bs ${result.transaccion.monto_bs.toFixed(2)})`);
    } catch (error) {
        console.log(`❌ ${error.message}`);
    }
    await pausa();
}
