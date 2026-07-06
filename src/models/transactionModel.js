export function agregarTransaccion(libroDiario, transaccion) {
    libroDiario.push(transaccion);
    return transaccion;
}

export function deshacerUltima(libroDiario) {
    if (libroDiario.length === 0) return null;
    return libroDiario.pop();
}

export function crearFactura(datos, transaccion, clienteNombre, clienteRif) {
    const numFactura = datos.ultimo_numero_factura + 1;
    datos.ultimo_numero_factura = numFactura;
    const precioUnitario = transaccion.cantidad > 0 ? transaccion.monto_usd / transaccion.cantidad : 0;
    const item = {
        producto: transaccion.producto,
        codigo: transaccion.codigo_producto || '',
        cantidad: transaccion.cantidad,
        precio_unitario_usd: precioUnitario,
        subtotal_usd: transaccion.monto_usd
    };
    const factura = {
        numero: `F${String(numFactura).padStart(3, '0')}`,
        fecha: transaccion.fecha,
        cliente: {
            id: transaccion.cliente_id || '',
            nombre: clienteNombre,
            rif: clienteRif
        },
        items: [item],
        subtotal_usd: transaccion.monto_usd,
        total_usd: transaccion.monto_usd,
        tasa_usada: transaccion.tasa_usada,
        total_bs: transaccion.monto_bs
    };
    datos.facturas.push(factura);
    return factura;
      }
// Añadir estas funciones al final del archivo
export function obtenerFacturasPendientes(facturas) {
    return facturas.filter(f => f.saldo_pendiente > 0);
}

export function obtenerFacturasPorCliente(facturas, clienteId) {
    return facturas.filter(f => f.cliente.id === clienteId);
}

export function calcularDeudaTotal(facturas, clienteId) {
    const facturasCliente = obtenerFacturasPorCliente(facturas, clienteId);
    return facturasCliente.reduce((total, f) => total + f.saldo_pendiente, 0);
}

export function actualizarSaldoFactura(factura, montoPagado) {
    factura.saldo_pendiente = Math.max(0, factura.saldo_pendiente - montoPagado);
    if (factura.saldo_pendiente === 0) {
        factura.estado = 'cancelada';
    } else if (factura.saldo_pendiente < factura.total_usd) {
        factura.estado = 'parcial';
    }
    return factura;
}
