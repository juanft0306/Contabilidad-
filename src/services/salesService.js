import { guardarDatos } from '../config/database.js';
import { agregarTransaccion, crearFactura } from '../models/transactionModel.js';
import { elegirTasaOperacion } from './rateService.js';

export function registrarVenta(datos, clienteId, productoNombre, cantidad, precioUnitarioUSD, tasa, tipoVenta = 'credito') {
    const producto = datos.productos[productoNombre];
    if (!producto) throw new Error('Producto no existe.');
    if (cantidad > producto.cantidad) throw new Error('Stock insuficiente.');
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
        tipo: 'venta',
        producto: productoNombre,
        codigo_producto: producto.codigo || '',
        cantidad,
        monto_usd,
        monto_bs,
        tasa_usada: tasa,
        cliente_id: clienteId,
        cuenta_debito: 'Caja',
        cuenta_credito: 'Ventas',
        detalle: `Venta de ${cantidad} ${producto.unidad} de ${productoNombre}`,
        tipo_venta: tipoVenta // 'contado' o 'credito'
    };
    
    agregarTransaccion(datos.libro_diario, transaccion);
    producto.cantidad -= cantidad;
    
    const cliente = datos.clientes[clienteId] || { nombre: 'Consumidor Final', rif: '' };
    // Crear factura con el tipo de venta
    const factura = crearFactura(datos, transaccion, cliente.nombre, cliente.rif, tipoVenta);
    
    guardarDatos(datos);
    return { transaccion, factura };
}

export function deshacerUltimaTransaccion(datos) {
    if (datos.libro_diario.length === 0) throw new Error('No hay transacciones.');
    const ultima = datos.libro_diario.pop();
    const producto = datos.productos[ultima.producto];
    if (producto) {
        if (ultima.tipo === 'venta') {
            producto.cantidad += ultima.cantidad;
        } else if (ultima.tipo === 'compra') {
            producto.cantidad -= ultima.cantidad;
        }
    }
    guardarDatos(datos);
    return ultima;
}
