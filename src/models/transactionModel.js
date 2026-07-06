export function agregarTransaccion(libroDiario, transaccion) {
    libroDiario.push(transaccion);
    return transaccion;
}

export function deshacerUltima(libroDiario) {
    if (libroDiario.length === 0) return null;
    return libroDiario.pop();
}

export function crearFactura(datos, transaccion, clienteNombre, clienteRif, tipoVenta = 'credito') {
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
    
    // Determinar estado y saldo pendiente según tipo de venta
    const esContado = tipoVenta === 'contado';
    const saldoPendiente = esContado ? 0 : transaccion.monto_usd;
    const estado = esContado ? 'cancelada' : 'pendiente';
    
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
        total_bs: transaccion.monto_bs,
        saldo_pendiente: saldoPendiente,
        estado: estado, // 'pendiente', 'parcial', 'cancelada'
        tipo_venta: tipoVenta, // 'contado' o 'credito'
        fecha_vencimiento: null // opcional, se puede calcular +30 días
    };
    datos.facturas.push(factura);
    return factura;
}

// ==========================================
// NUEVAS FUNCIONES PARA CUENTAS POR COBRAR
// ==========================================

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

export function obtenerResumenCartera(facturas) {
    const resumen = {};
    for (const factura of facturas) {
        if (factura.saldo_pendiente > 0) {
            const clienteId = factura.cliente.id || 'sin-id';
            if (!resumen[clienteId]) {
                resumen[clienteId] = {
                    id: clienteId,
                    nombre: factura.cliente.nombre || 'Cliente sin nombre',
                    deudaTotal: 0,
                    facturas: []
                };
            }
            resumen[clienteId].deudaTotal += factura.saldo_pendiente;
            resumen[clienteId].facturas.push(factura);
        }
    }
    return Object.values(resumen);
}
