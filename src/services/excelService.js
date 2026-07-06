import XLSX from 'xlsx';
import fs from 'fs';

/**
 * Exporta todos los datos a un archivo Excel (buffer)
 */
export function exportarDatosAExcel(datos) {
    const workbook = XLSX.utils.book_new();

    // Hoja: Productos
    const productosData = Object.entries(datos.productos).map(([nombre, info]) => ({
        Nombre: nombre,
        Código: info.codigo || '',
        Categoría: info.categoria || 'General',
        Precio_USD: info.precio_usd,
        Cantidad: info.cantidad,
        Unidad: info.unidad || 'u'
    }));
    const hojaProductos = XLSX.utils.json_to_sheet(productosData);
    XLSX.utils.book_append_sheet(workbook, hojaProductos, 'Productos');

    // Hoja: Clientes
    const clientesData = Object.entries(datos.clientes).map(([id, info]) => ({
        ID: id,
        Nombre: info.nombre,
        RIF: info.rif || '',
        Teléfono: info.telefono || ''
    }));
    const hojaClientes = XLSX.utils.json_to_sheet(clientesData);
    XLSX.utils.book_append_sheet(workbook, hojaClientes, 'Clientes');

    // Hoja: Proveedores
    const proveedoresData = Object.entries(datos.proveedores).map(([id, info]) => ({
        ID: id,
        Nombre: info.nombre,
        RIF: info.rif || '',
        Teléfono: info.telefono || ''
    }));
    const hojaProveedores = XLSX.utils.json_to_sheet(proveedoresData);
    XLSX.utils.book_append_sheet(workbook, hojaProveedores, 'Proveedores');

    // Hoja: Facturas
    const facturasData = datos.facturas.map(f => ({
        Número: f.numero,
        Fecha: f.fecha,
        Cliente: f.cliente.nombre,
        'Total USD': f.total_usd,
        'Total Bs': f.total_bs,
        Tasa: f.tasa_usada
    }));
    const hojaFacturas = XLSX.utils.json_to_sheet(facturasData);
    XLSX.utils.book_append_sheet(workbook, hojaFacturas, 'Facturas');

    // Hoja: Libro Diario (transacciones)
    const libroData = datos.libro_diario.map(t => ({
        Fecha: t.fecha,
        Tipo: t.tipo,
        Producto: t.producto,
        Cantidad: t.cantidad,
        'Monto USD': t.monto_usd,
        'Monto Bs': t.monto_bs,
        Tasa: t.tasa_usada,
        Detalle: t.detalle
    }));
    const hojaLibro = XLSX.utils.json_to_sheet(libroData);
    XLSX.utils.book_append_sheet(workbook, hojaLibro, 'LibroDiario');

    // Hoja: Tasas e histórico (resumen)
    const tasasData = Object.entries(datos.tasas).map(([nombre, info]) => ({
        Nombre: nombre,
        Valor: info.valor,
        'Última actualización': info.ultima_actualizacion || ''
    }));
    const hojaTasas = XLSX.utils.json_to_sheet(tasasData);
    XLSX.utils.book_append_sheet(workbook, hojaTasas, 'Tasas');

    // Hoja: Configuración empresa
    const configData = [{
        Nombre: datos.config_empresa.nombre,
        RIF: datos.config_empresa.rif,
        Dirección: datos.config_empresa.direccion || '',
        Teléfono: datos.config_empresa.telefono || ''
    }];
    const hojaConfig = XLSX.utils.json_to_sheet(configData);
    XLSX.utils.book_append_sheet(workbook, hojaConfig, 'ConfigEmpresa');

    // Generar buffer del archivo Excel
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    return buffer;
}

/**
 * Importa datos desde un archivo Excel (buffer) y los convierte en un objeto datos.
 * @param {Buffer} buffer - Contenido del archivo Excel
 * @returns {Object} - Datos estructurados listos para guardar
 */
export function importarDatosDesdeExcel(buffer) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    // Leer cada hoja
    const productos = {};
    const hojaProductos = XLSX.utils.sheet_to_json(workbook.Sheets['Productos'] || []);
    for (const row of hojaProductos) {
        const nombre = row.Nombre?.trim();
        if (!nombre) continue;
        productos[nombre] = {
            codigo: row.Código || '',
            categoria: row.Categoría || 'General',
            precio_usd: parseFloat(row.Precio_USD) || 0,
            cantidad: parseInt(row.Cantidad) || 0,
            unidad: row.Unidad || 'u'
        };
    }

    const clientes = {};
    const hojaClientes = XLSX.utils.sheet_to_json(workbook.Sheets['Clientes'] || []);
    for (const row of hojaClientes) {
        const id = String(row.ID || Object.keys(clientes).length + 1);
        clientes[id] = {
            nombre: row.Nombre || '',
            rif: row.RIF || '',
            telefono: row.Teléfono || ''
        };
    }

    const proveedores = {};
    const hojaProveedores = XLSX.utils.sheet_to_json(workbook.Sheets['Proveedores'] || []);
    for (const row of hojaProveedores) {
        const id = String(row.ID || Object.keys(proveedores).length + 1);
        proveedores[id] = {
            nombre: row.Nombre || '',
            rif: row.RIF || '',
            telefono: row.Teléfono || ''
        };
    }

    const facturas = [];
    const hojaFacturas = XLSX.utils.sheet_to_json(workbook.Sheets['Facturas'] || []);
    for (const row of hojaFacturas) {
        facturas.push({
            numero: row.Número || `F${String(facturas.length + 1).padStart(3, '0')}`,
            fecha: row.Fecha || new Date().toISOString().replace('T', ' ').slice(0, 19),
            cliente: { nombre: row.Cliente || 'Consumidor Final', rif: '', id: '' },
            items: [],
            subtotal_usd: parseFloat(row['Total USD']) || 0,
            total_usd: parseFloat(row['Total USD']) || 0,
            total_bs: parseFloat(row['Total Bs']) || 0,
            tasa_usada: parseFloat(row.Tasa) || 1
        });
    }

    const libro_diario = [];
    const hojaLibro = XLSX.utils.sheet_to_json(workbook.Sheets['LibroDiario'] || []);
    for (const row of hojaLibro) {
        libro_diario.push({
            fecha: row.Fecha || new Date().toISOString().replace('T', ' ').slice(0, 19),
            tipo: row.Tipo || 'venta',
            producto: row.Producto || '',
            cantidad: parseInt(row.Cantidad) || 0,
            monto_usd: parseFloat(row['Monto USD']) || 0,
            monto_bs: parseFloat(row['Monto Bs']) || 0,
            tasa_usada: parseFloat(row.Tasa) || 1,
            detalle: row.Detalle || ''
        });
    }

    const tasas = {};
    const hojaTasas = XLSX.utils.sheet_to_json(workbook.Sheets['Tasas'] || []);
    for (const row of hojaTasas) {
        const nombre = row.Nombre?.trim();
        if (nombre) {
            tasas[nombre] = {
                valor: parseFloat(row.Valor) || 0,
                ultima_actualizacion: row['Última actualización'] || ''
            };
        }
    }

    let config_empresa = {};
    const hojaConfig = XLSX.utils.sheet_to_json(workbook.Sheets['ConfigEmpresa'] || []);
    if (hojaConfig.length > 0) {
        config_empresa = {
            nombre: hojaConfig[0].Nombre || 'Mi Negocio',
            rif: hojaConfig[0].RIF || 'J-12345678-9',
            direccion: hojaConfig[0].Dirección || '',
            telefono: hojaConfig[0].Teléfono || ''
        };
    }

    // Reconstruir el objeto datos
    return {
        productos,
        clientes,
        proveedores,
        facturas,
        libro_diario,
        tasas,
        config_empresa,
        // Mantener otras propiedades con valores por defecto
        categorias: ['General'],
        cuentas: ['Caja', 'Ventas', 'Inventario', 'Capital'],
        ultimo_numero_factura: facturas.length,
        ultimo_id_cliente: Object.keys(clientes).length,
        ultimo_id_proveedor: Object.keys(proveedores).length,
        password_hash: null,
        password_salt: '',
        historico_tasas: []
    };
}
