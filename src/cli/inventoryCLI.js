import { cprint, limpiarPantalla, pausa, leerNumero, leerEntero, confirmar } from '../utils/helpers.js';
import * as inventoryService from '../services/inventoryService.js';

export async function menuInventario(datos) {
    let volver = false;
    while (!volver) {
        limpiarPantalla();
        cprint('--- INVENTARIO ---', '\x1b[34m', true);
        console.log('1. Listar productos');
        console.log('2. Agregar producto');
        console.log('3. Buscar producto');
        console.log('4. Actualizar stock');
        console.log('5. Editar producto');
        console.log('6. Eliminar producto');
        console.log('7. Volver');

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
            case '1': {
                const productos = inventoryService.listarProductos(datos);
                if (productos.length === 0) {
                    console.log('No hay productos.');
                } else {
                    for (const [nombre, info] of productos) {
                        console.log(`${info.codigo || 'S/C'} - ${nombre}: ${info.cantidad} ${info.unidad} (${info.categoria})`);
                    }
                }
                await pausa();
                break;
            }
            case '2': {
                const nombre = await new Promise(resolve => {
                    const readline = require('readline').createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });
                    readline.question('Nombre del producto: ', respuesta => {
                        readline.close();
                        resolve(respuesta.trim().toLowerCase());
                    });
                });
                if (!nombre) break;
                const codigo = await new Promise(resolve => {
                    const readline = require('readline').createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });
                    readline.question('Código (Enter para auto-generar): ', respuesta => {
                        readline.close();
                        resolve(respuesta.trim().toUpperCase());
                    });
                });
                const categoria = await new Promise(resolve => {
                    const readline = require('readline').createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });
                    readline.question('Categoría (General): ', respuesta => {
                        readline.close();
                        resolve(respuesta.trim() || 'General');
                    });
                });
                const precio = await leerNumero('Precio USD: ', parseFloat);
                if (precio === null) break;
                const cantidad = await leerEntero('Cantidad: ');
                if (cantidad === null) break;
                const unidad = await new Promise(resolve => {
                    const readline = require('readline').createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });
                    readline.question('Unidad (u): ', respuesta => {
                        readline.close();
                        resolve(respuesta.trim() || 'u');
                    });
                });
                try {
                    inventoryService.agregarProducto(datos, nombre, codigo, categoria, precio, cantidad, unidad);
                    console.log('✅ Producto agregado.');
                } catch (error) {
                    console.log(`❌ ${error.message}`);
                }
                await pausa();
                break;
            }
            case '6': {
                const nombre = await new Promise(resolve => {
                    const readline = require('readline').createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });
                    readline.question('Producto a eliminar: ', respuesta => {
                        readline.close();
                        resolve(respuesta.trim().toLowerCase());
                    });
                });
                if (!nombre) break;
                if (await confirmar(`¿Eliminar ${nombre}?`)) {
                    try {
                        inventoryService.eliminarProducto(datos, nombre);
                        console.log('✅ Producto eliminado.');
                    } catch (error) {
                        console.log(`❌ ${error.message}`);
                    }
                }
                await pausa();
                break;
            }
            case '7': volver = true; break;
            default: console.log('Opción no válida.'); await pausa();
        }
    }
}
