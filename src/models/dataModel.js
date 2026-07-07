export function inicializarDatos() {
    return {
        tasas: {},
        historico_tasas: [],
        productos: {},
        categorias: ['General'],
        clientes: {},
        proveedores: {},
        cuentas: ['Caja', 'Ventas', 'Inventario', 'Capital'],
        libro_diario: [],
        facturas: [],
        ultimo_numero_factura: 0,
        config_empresa: {
            nombre: 'Mi Negocio',
            rif: 'J-12345678-9',
            direccion: '',
            telefono: ''
        },
        password_hash: null,
        password_salt: '',
        ultimo_id_cliente: 0,
        ultimo_id_proveedor: 0,
        // NUEVOS CAMPOS PARA MODO PRUEBA
        modo_prueba_activo: false,
        datos_prueba: null // Copia de los datos antes de activar modo prueba
    };
}
