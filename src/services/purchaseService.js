import { guardarDatos } from '../config/database.js';
import { agregarTransaccion } from '../models/transactionModel.js';
import { elegirTasaOperacion } from './rateService.js';

export function registrarCompra(datos, proveedorId, productoNombre, cantidad, precioUnitarioUSD, tasa) {
    const producto = datos.productos[productoNombre];
    if (!producto) throw new Error('Producto no existe.');
    if (!tasa) {
        const tasaObj = elegirTasaOperacion(datos);
        if (!tasaObj) throw new Error('No hay tasa disponible.');
        tasa = tasaObj.valor;
    }
    const monto_usd = cantidad * precioUnitarioUSD;
    const monto_bs = monto_usd * tasa;
    const fecha = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const transaccion = {
        fecha,
        tipo: 'compra',
        producto: productoNombre,
        codigo_producto: producto.codigo || '',
        cantidad,
        monto_usd,
        monto_bs,
        tasa_usada: tasa,
        proveedor_id: proveedorId,
        cuenta_debito: 'Inventario',
        cuenta_credito: 'Caja',
        detalle: `Compra de ${cantidad} ${producto.unidad} de ${productoNombre}`
    };
    agregarTransaccion(datos.libro_diario, transaccion);
    producto.cantidad += cantidad;
    guardarDatos(datos);
    return transaccion;
}
