import { limpiarPantalla, cprint, pausa } from '../utils/helpers.js';
import { menuInventario } from './inventoryCLI.js';
import { menuVentas } from './salesCLI.js';
import { menuCompras } from './purchaseCLI.js';
import { menuContabilidad } from './accountingCLI.js';
import { menuClientes } from './clientCLI.js';
import { menuConfiguracion } from './configCLI.js';
import { menuFacturas } from './facturaCLI.js';

export async function iniciarCLI(datos) {
    let salir = false;
    while (!salir) {
        limpiarPantalla();
        cprint('='.repeat(50), '\x1b[35m', true);
        cprint('   MENÚ PRINCIPAL', '\x1b[1m\x1b[35m');
        cprint('='.repeat(50), '\x1b[35m', true);
        console.log(`Hora: ${new Date().toLocaleString()}`);
        console.log('1. Inventario');
        console.log('2. Ventas');
        console.log('3. Compras');
        console.log('4. Contabilidad');
        console.log('5. Clientes y Proveedores');
        console.log('6. Configuración');
        console.log('7. Facturas');
        console.log('8. Salir');

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

        switch (opcion) {
            case '1': await menuInventario(datos); break;
            case '2': await menuVentas(datos); break;
            case '3': await menuCompras(datos); break;
            case '4': await menuContabilidad(datos); break;
            case '5': await menuClientes(datos); break;
            case '6': await menuConfiguracion(datos); break;
            case '7': await menuFacturas(datos); break;
            case '8': salir = true; console.log('¡Hasta luego!'); break;
            default: console.log('Opción no válida.'); await pausa();
        }
    }
}
