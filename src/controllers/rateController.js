import * as rateService from '../services/rateService.js';
import { guardarDatos } from '../config/database.js';

export async function actualizarTasaInternet(req, res) {
    try {
        const { nombre = 'BCV' } = req.body;
        const result = await rateService.obtenerTasaInternet(nombre);
        if (result) {
            const datos = req.app.locals.datos;
            const fecha = new Date().toISOString().replace('T', ' ').slice(0, 19);
            datos.tasas[nombre] = { valor: result.tasa, ultima_actualizacion: fecha };
            datos.historico_tasas.push({ nombre, valor: result.tasa, fecha });
            guardarDatos(datos);
            res.json({ message: 'Tasa actualizada', tasa: result.tasa });
        } else {
            res.status(500).json({ error: 'No se pudo obtener la tasa' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
