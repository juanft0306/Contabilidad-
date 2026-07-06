import * as paymentService from '../services/paymentService.js';

export function registrarPago(req, res) {
    try {
        const { facturaNumero, monto, metodoPago, moneda, tasa, referencia } = req.body;
        const datos = req.app.locals.datos;
        const result = paymentService.registrarPago(
            datos,
            facturaNumero,
            parseFloat(monto),
            metodoPago,
            moneda,
            tasa ? parseFloat(tasa) : 1,
            referencia || ''
        );
        res.status(201).json({ success: true, message: 'Pago registrado', pago: result.pago, factura: result.factura });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

export function obtenerDeudaCliente(req, res) {
    try {
        const { clienteId } = req.params;
        const datos = req.app.locals.datos;
        const deuda = paymentService.obtenerDeudaCliente(datos, clienteId);
        res.json({ clienteId, deuda });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export function obtenerResumenCartera(req, res) {
    try {
        const datos = req.app.locals.datos;
        const resumen = paymentService.obtenerResumenCartera(datos);
        res.json(resumen);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
