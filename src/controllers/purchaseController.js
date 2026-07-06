import * as purchaseService from '../services/purchaseService.js';

export function registrarCompra(req, res) {
    try {
        const { proveedorId, productoNombre, cantidad, precioUnitarioUSD, tasa } = req.body;
        const datos = req.app.locals.datos;
        const result = purchaseService.registrarCompra(datos, proveedorId, productoNombre, parseInt(cantidad), parseFloat(precioUnitarioUSD), tasa ? parseFloat(tasa) : null);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
