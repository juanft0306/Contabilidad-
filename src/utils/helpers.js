import { COLORES } from '../config/constants.js';
import readline from 'readline';

export function cprint(texto, color = COLORES.reset, bold = false) {
    const prefijo = bold ? COLORES.bold : '';
    console.log(`${prefijo}${color}${texto}${COLORES.reset}`);
}

export function limpiarPantalla() {
    process.stdout.write('\x1b[2J\x1b[0;0H');
}

export function pausa(mensaje = 'Presiona Enter para continuar...') {
    return new Promise(resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(`${COLORES.cyan}${mensaje}${COLORES.reset}`, () => {
            rl.close();
            resolve();
        });
    });
}

export async function leerNumero(mensaje, tipo = Number, permitirCancelar = true) {
    return new Promise(resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(mensaje, entrada => {
            rl.close();
            if (permitirCancelar && entrada.toLowerCase() === 'cancelar') {
                resolve(null);
                return;
            }
            const valor = tipo(entrada);
            if (isNaN(valor)) {
                console.log('❌ Número no válido. Intenta de nuevo.');
                resolve(leerNumero(mensaje, tipo, permitirCancelar));
            } else {
                resolve(valor);
            }
        });
    });
}

export async function leerEntero(mensaje, permitirCancelar = true) {
    return leerNumero(mensaje, parseInt, permitirCancelar);
}

export async function confirmar(mensaje = '¿Estás seguro? (S/N): ') {
    return new Promise(resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(`${COLORES.yellow}${mensaje}${COLORES.reset}`, respuesta => {
            rl.close();
            resolve(respuesta.toLowerCase() === 's');
        });
    });
}
