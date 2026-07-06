import { cprint, limpiarPantalla, pausa, confirmar } from '../utils/helpers.js';
import { agregarCliente, agregarProveedor, eliminarCliente, eliminarProveedor } from '../models/clientModel.js';
import { guardarDatos } from '../config/database.js';

export async function menuClientes(datos) {
    limpiarPantalla();
    cprint('--- CLIENTES Y PROVEEDORES ---', '\x1b[36m', true);
    console.log('1. Listar clientes');
    console.log('2. Agregar cliente');
    console.log('3. Eliminar cliente');
    console.log('4. Listar proveedores');
    console.log('5. Agregar proveedor');
    console.log('6. Eliminar proveedor');
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
    if (opcion === '1') {
        for (const [id, c] of Object.entries(datos.clientes)) {
            console.log(`${id}: ${c.nombre} - ${c.rif}`);
        }
        await pausa();
    } else if (opcion === '2') {
        const nombre = await new Promise(resolve => {
            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });
            readline.question('Nombre: ', respuesta => {
                readline.close();
                resolve(respuesta.trim());
            });
        });
        const rif = await new Promise(resolve => {
            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });
            readline.question('RIF: ', respuesta => {
                readline.close();
                resolve(respuesta.trim());
            });
        });
        const telefono = await new Promise(resolve => {
            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });
            readline.question('Teléfono: ', respuesta => {
                readline.close();
                resolve(respuesta.trim());
            });
        });
        const result = agregarCliente(datos.clientes, nombre, rif, telefono, datos.ultimo_id_cliente);
        datos.ultimo_id_cliente = result.nuevoUltimoId;
        guardarDatos(datos);
        console.log('✅ Cliente agregado.');
        await pausa();
    } else if (opcion === '3') {
        const id = await new Promise(resolve => {
            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });
            readline.question('ID del cliente: ', respuesta => {
                readline.close();
                resolve(respuesta.trim());
            });
        });
        if (await confirmar('¿Eliminar cliente?')) {
            try {
                eliminarCliente(datos.clientes, id);
                guardarDatos(datos);
                console.log('✅ Cliente eliminado.');
            } catch (error) {
                console.log(`❌ ${error.message}`);
            }
        }
        await pausa();
    } else if (opcion === '4') {
        for (const [id, p] of Object.entries(datos.proveedores)) {
            console.log(`${id}: ${p.nombre} - ${p.rif}`);
        }
        await pausa();
    } else if (opcion === '5') {
        const nombre = await new Promise(resolve => {
            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });
            readline.question('Nombre: ', respuesta => {
                readline.close();
                resolve(respuesta.trim());
            });
        });
        const rif = await new Promise(resolve => {
            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });
            readline.question('RIF: ', respuesta => {
                readline.close();
                resolve(respuesta.trim());
            });
        });
        const telefono = await new Promise(resolve => {
            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });
            readline.question('Teléfono: ', respuesta => {
                readline.close();
                resolve(respuesta.trim());
            });
        });
        const result = agregarProveedor(datos.proveedores, nombre, rif, telefono, datos.ultimo_id_proveedor);
        datos.ultimo_id_proveedor = result.nuevoUltimoId;
        guardarDatos(datos);
        console.log('✅ Proveedor agregado.');
        await pausa();
    } else if (opcion === '6') {
        const id = await new Promise(resolve => {
            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });
            readline.question('ID del proveedor: ', respuesta => {
                readline.close();
                resolve(respuesta.trim());
            });
        });
        if (await confirmar('¿Eliminar proveedor?')) {
            try {
                eliminarProveedor(datos.proveedores, id);
                guardarDatos(datos);
                console.log('✅ Proveedor eliminado.');
            } catch (error) {
                console.log(`❌ ${error.message}`);
            }
        }
        await pausa();
    }
              }
