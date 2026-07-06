import { createObjectCsvWriter } from 'csv-writer';

export async function exportarInventario(datos, filePath = 'inventario.csv') {
    const records = Object.entries(datos.productos).map(([nombre, info]) => ({
        codigo: info.codigo || '',
        producto: nombre,
        categoria: info.categoria,
        cantidad: info.cantidad,
        unidad: info.unidad,
        precio_usd: info.precio_usd
    }));
    const writer = createObjectCsvWriter({
        path: filePath,
        header: [
            { id: 'codigo', title: 'Código' },
            { id: 'producto', title: 'Producto' },
            { id: 'categoria', title: 'Categoría' },
            { id: 'cantidad', title: 'Cantidad' },
            { id: 'unidad', title: 'Unidad' },
            { id: 'precio_usd', title: 'Precio USD' }
        ]
    });
    await writer.writeRecords(records);
}

export async function exportarLibroDiario(datos, filePath = 'libro_diario.csv') {
    const records = datos.libro_diario.map(t => ({
        fecha: t.fecha,
        tipo: t.tipo,
        producto: t.producto,
        cantidad: t.cantidad,
        monto_usd: t.monto_usd,
        monto_bs: t.monto_bs,
        tasa: t.tasa_usada,
        detalle: t.detalle
    }));
    const writer = createObjectCsvWriter({
        path: filePath,
        header: [
            { id: 'fecha', title: 'Fecha' },
            { id: 'tipo', title: 'Tipo' },
            { id: 'producto', title: 'Producto' },
            { id: 'cantidad', title: 'Cantidad' },
            { id: 'monto_usd', title: 'Monto USD' },
            { id: 'monto_bs', title: 'Monto Bs' },
            { id: 'tasa', title: 'Tasa' },
            { id: 'detalle', title: 'Detalle' }
        ]
    });
    await writer.writeRecords(records);
}
