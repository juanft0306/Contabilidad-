import { limpiarPantalla, cprint, pausa, confirmar } from '../utils/helpers.js';
import * as modoPruebaService from '../services/modoPruebaService.js';
import { guardarDatos } from '../config/database.js';

export async function iniciarCLI(datos) {
    let salir = false;
    while (!salir) {
        limpiarPantalla();
        cprint('='.repeat(50), '\x1b[35m', true);
        cprint('   MENÚ PRINCIPAL', '\x1b[1m\x1b[35m');
        cprint('='.repeat(50), '\x1b[35m', true);
        console.log(`Hora: ${new Date().toLocaleString()}`);
        
        // Mostrar estado del modo prueba
        if (modoPruebaService.estaEnModoPrueba(datos)) {
            cprint('⚠️  MODO PRUEBA ACTIVO - Los cambios no se guardan', '\x1b[33m', true);
        }
        console.log('');
        console.log('1. Inventario');
        console.log('2. Ventas');
        console.log('3. Compras');
        console.log('4. Contabilidad');
        console.log('5. Clientes y Proveedores');
        console.log('6. Configuración');
        console.log('7. Facturas');
        console.log('8. Cuentas por Cobrar');
        console.log('9. Modo Prueba');
        console.log('10. Salir');

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
            case '8': await menuCuentasPorCobrar(datos); break;
            case '9': await menuModoPrueba(datos); break;
            case '10': salir = true; console.log('¡Hasta luego!'); break;
            default: console.log('Opción no válida.'); await pausa();
        }
    }
}

// ==========================================
// SUBMENÚ: MODO PRUEBA
// ==========================================
async function menuModoPrueba(datos) {
    limpiarPantalla();
    cprint('--- MODO PRUEBA ---', '\x1b[33m', true);
    
    const activo = modoPruebaService.estaEnModoPrueba(datos);
    console.log(`Estado actual: ${activo ? '🟡 ACTIVADO' : '🟢 DESACTIVADO'}`);
    console.log('');
    
    if (activo) {
        console.log('1. Desactivar modo prueba (borrar cambios)');
        console.log('2. Volver');
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
            if (await confirmar('⚠️ ¿Desactivar modo prueba? Se borrarán TODOS los cambios realizados.')) {
                try {
                    modoPruebaService.desactivarModoPrueba(datos);
                    console.log('✅ Modo prueba desactivado. Datos restaurados.');
                } catch (error) {
                    console.log(`❌ ${error.message}`);
                }
            }
        }
    } else {
        console.log('1. Activar modo prueba (guardar copia de seguridad)');
        console.log('2. Volver');
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
            if (await confirmar('⚠️ ¿Activar modo prueba? Se guardará copia de seguridad de tus datos actuales.')) {
                try {
                    modoPruebaService.activarModoPrueba(datos);
                    console.log('✅ Modo prueba activado. Puedes hacer cambios sin afectar los datos reales.');
                } catch (error) {
                    console.log(`❌ ${error.message}`);
                }
            }
        }
    }
    await pausa();
}

// ==========================================
// SUBMENÚS (versiones simplificadas para no alargar)
// ==========================================

async function menuInventario(datos) {
    // ... (código del menú de inventario)
    console.log('Próximamente: Inventario');
    await pausa();
}

async function menuVentas(datos) {
    console.log('Próximamente: Ventas');
    await pausa();
}

async function menuCompras(datos) {
    console.log('Próximamente: Compras');
    await pausa();
}

async function menuContabilidad(datos) {
    console.log('Próximamente: Contabilidad');
    await pausa();
}

async function menuClientes(datos) {
    console.log('Próximamente: Clientes');
    await pausa();
}

async function menuConfiguracion(datos) {
    console.log('Próximamente: Configuración');
    await pausa();
}

async function menuFacturas(datos) {
    console.log('Próximamente: Facturas');
    await pausa();
}

async function menuCuentasPorCobrar(datos) {
    console.log('Próximamente: Cuentas por Cobrar');
    await pausa();
                }
