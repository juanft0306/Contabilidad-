import axios from 'axios';
import { actualizarTasa } from '../models/rateModel.js';

export async function obtenerTasaInternet(nombre = 'BCV') {
    try {
        const url = 'https://ve.dolar-api.com/api/v1/dolar/BCV';
        const response = await axios.get(url, { timeout: 5000 });
        if (response.status === 200 && response.data.rate) {
            const tasa = parseFloat(response.data.rate);
            const fecha = new Date().toISOString().replace('T', ' ').slice(0, 19);
            return { tasa, fecha };
        }
        return null;
    } catch (error) {
        console.error('Error obteniendo tasa:', error.message);
        return null;
    }
}

export function elegirTasaOperacion(datos) {
    const disponibles = Object.entries(datos.tasas)
        .filter(([_, info]) => info.valor > 0)
        .map(([nombre, info]) => ({ nombre, valor: info.valor }));
    if (disponibles.length === 0) return null;
    return disponibles[0];
}
