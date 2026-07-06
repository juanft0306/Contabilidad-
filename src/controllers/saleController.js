import * as salesService from '../services/salesService.js';

export function registrarVenta(req, res) {
    try {
        const { clienteId, productoNombre, cantidad, precioUnitarioUSD, tasa } = req.body;
        const datos = req.app.locals.datos;
        const result = salesService.registrarVenta(datos, clienteId, productoNombre, parseInt(cantidad), parseFloat(precioUnitarioUSD), tasa ? parseFloat(tasa) : null);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
