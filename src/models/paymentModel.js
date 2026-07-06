export function crearPago(datos, facturaId, monto, metodoPago, moneda, tasa = 1, referencia = '') {
    const pago = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        facturaId,
        fecha: new Date().toISOString().replace('T', ' ').slice(0, 19),
        monto,
        metodoPago, // 'efectivo', 'pago_movil', 'transferencia', 'usd'
        moneda, // 'Bs' o 'USD'
        tasa,
        referencia,
        estado: 'completado'
    };
    if (!datos.pagos) datos.pagos = [];
    datos.pagos.push(pago);
    return pago;
}

export function obtenerPagosPorFactura(pagos, facturaId) {
    return pagos.filter(p => p.facturaId === facturaId);
}
