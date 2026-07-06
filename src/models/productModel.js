import { CATEGORIA_DEFAULT } from '../config/constants.js';

export function generarCodigo(productos) {
    const pattern = /^([A-Z])(\d{3})$/;
    let maxLetra = 'A'.charCodeAt(0);
    let maxNum = 0;
    for (const prod of Object.values(productos)) {
        const codigo = prod.codigo || '';
        const match = codigo.match(pattern);
        if (match) {
            const letra = match[1];
            const num = parseInt(match[2]);
            const letraCode = letra.charCodeAt(0);
            if (letraCode > maxLetra || (letraCode === maxLetra && num > maxNum)) {
                maxLetra = letraCode;
                maxNum = num;
            }
        }
    }
    let nextNum = maxNum + 1;
    let nextLetra = String.fromCharCode(maxLetra);
    if (nextNum > 999) {
        nextNum = 1;
        if (maxLetra < 'Z'.charCodeAt(0)) {
            nextLetra = String.fromCharCode(maxLetra + 1);
        } else {
            nextLetra = 'A';
        }
    }
    return `${nextLetra}${String(nextNum).padStart(3, '0')}`;
}

export function validarCodigo(codigo, productos) {
    if (!/^[A-Z]\d{3}$/.test(codigo)) return false;
    for (const p of Object.values(productos)) {
        if (p.codigo === codigo) return false;
    }
    return true;
}

export function obtenerProductoPorNombreONombre(productos, nombre) {
    const lower = nombre.toLowerCase();
    if (productos[lower]) return { nombre: lower, info: productos[lower] };
    for (const [key, val] of Object.entries(productos)) {
        if (val.codigo && val.codigo.toLowerCase() === lower) {
            return { nombre: key, info: val };
        }
    }
    return null;
}
