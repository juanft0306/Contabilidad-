import { guardarDatos } from '../config/database.js';
import { crearPago } from '../models/paymentModel.js';
import { actualizarSaldoFactura } from '../models/transactionModel.js';

export function registrarPago(datos, facturaNumero, monto, metodoPago, moneda, tasa = 1, referencia = '') {
    // Buscar factura
    const factura = datos.facturas.find(f => f.numero === facturaNumero);
    if (!factura) throw new Error('Factura no encontrada');
    if (factura.saldo_pendiente <= 0) throw new Error('Esta factura ya está cancelada');
    if (monto > factura.saldo_pendiente) throw new Error('El monto excede el saldo pendiente');

    // Crear pago
    const pago = crearPago(datos, factura.id || facturaNumero, monto, metodoPago, moneda, tasa, referencia);

    // Actualizar saldo de la factura
    actualizarSaldoFactura(factura, monto);

    // Guardar cambios
    guardarDatos(datos);
    return { pago, factura };
}

export function obtenerDeudaCliente(datos, clienteId) {
    const facturasCliente = datos.facturas.filter(f => f.cliente.id === clienteId);
    return facturasCliente.reduce((total, f) => total + f.saldo_pendiente, 0);
}

export function obtenerResumenCartera(datos) {
    const resumen = {};
    for (const factura of datos.facturas) {
        if (factura.saldo_pendiente > 0) {
            const clienteId = factura.cliente.id;
            if (!resumen[clienteId]) {
                resumen[clienteId] = {
                    cliente: factura.cliente.nombre,
                    totalDeuda: 0,
                    facturas: []
                };
            }
            resumen[clienteId].totalDeuda += factura.saldo_pendiente;
            resumen[clienteId].facturas.push(factura);
        }
    }
    return Object.values(resumen);
}
