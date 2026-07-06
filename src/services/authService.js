import { hashPassword, comparePassword } from '../utils/crypto.js';
import { guardarDatos } from '../config/database.js';

export function verificarPassword(datos, password) {
    if (!datos.password_hash) return true;
    return comparePassword(password, datos.password_hash);
}

export function establecerPassword(datos, nuevaPassword) {
    if (nuevaPassword) {
        datos.password_hash = hashPassword(nuevaPassword);
    } else {
        datos.password_hash = null;
    }
    guardarDatos(datos);
}
