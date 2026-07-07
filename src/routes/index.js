import express from 'express';
import productRoutes from './productRoutes.js';
import saleRoutes from './saleRoutes.js';
import purchaseRoutes from './purchaseRoutes.js';
import accountingRoutes from './accountingRoutes.js';
import rateRoutes from './rateRoutes.js';
import clientRoutes from './clientRoutes.js';
import authRoutes from './authRoutes.js';
import backupRoutes from './backupRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import modoPruebaRoutes from './modoPruebaRoutes.js';

const router = express.Router();

// ==========================================
// PÁGINA PRINCIPAL
// ==========================================
router.get('/', (req, res) => {
    res.render('index');
});

// ==========================================
// RUTAS API
// ==========================================
router.use('/api/productos', productRoutes);
router.use('/api/ventas', saleRoutes);
router.use('/api/compras', purchaseRoutes);
router.use('/api/contabilidad', accountingRoutes);
router.use('/api/tasas', rateRoutes);
router.use('/api/clientes', clientRoutes);
router.use('/api/auth', authRoutes);
router.use('/api/backup', backupRoutes);
router.use('/api/pagos', paymentRoutes);
router.use('/api/modo-prueba', modoPruebaRoutes);

// ==========================================
// VISTAS (PÁGINAS WEB)
// ==========================================

// Inventario
router.get('/inventario', (req, res) => {
    res.render('inventario');
});

router.get('/inventario/agregar', (req, res) => {
    res.render('agregar_producto');
});

// Ventas
router.get('/ventas', (req, res) => {
    res.render('ventas');
});

// Facturas
router.get('/facturas', (req, res) => {
    res.render('facturas');
});

router.get('/factura/:numero', (req, res) => {
    const factura = req.app.locals.datos.facturas.find(f => f.numero === req.params.numero);
    if (!factura) {
        res.status(404).send('Factura no encontrada');
        return;
    }
    res.render('factura_detalle', { factura });
});

// Contabilidad
router.get('/contabilidad', (req, res) => {
    res.render('contabilidad');
});

router.get('/balance', (req, res) => {
    res.render('balance');
});

// Configuración
router.get('/configuracion', (req, res) => {
    res.render('configuracion');
});

// Cuentas por Cobrar
router.get('/cuentas-por-cobrar', (req, res) => {
    const datos = req.app.locals.datos;
    const cartera = {};
    for (const factura of datos.facturas) {
        if (factura.saldo_pendiente > 0) {
            const clienteId = factura.cliente.id || 'sin-id';
            if (!cartera[clienteId]) {
                cartera[clienteId] = {
                    id: clienteId,
                    nombre: factura.cliente.nombre || 'Cliente sin nombre',
                    deudaTotal: 0,
                    facturas: []
                };
            }
            cartera[clienteId].deudaTotal += factura.saldo_pendiente;
            cartera[clienteId].facturas.push(factura);
        }
    }
    const resumenCartera = Object.values(cartera);
    res.render('cuentas_por_cobrar', { cartera: resumenCartera });
});

router.get('/registrar-pago', (req, res) => {
    const datos = req.app.locals.datos;
    const facturasPendientes = datos.facturas.filter(f => f.saldo_pendiente > 0);
    res.render('registrar_pago', { facturasPendientes });
});

// Gastos
router.get('/gastos', (req, res) => {
    const datos = req.app.locals.datos;
    const gastos = datos.gastos || [];
    const categorias = datos.categorias_gastos || ['Pasaje', 'Combustible', 'Mantenimiento', 'Sueldos', 'Alquiler', 'Impuestos', 'Otros'];
    res.render('gastos', { gastos, categorias });
});

router.get('/gastos/agregar', (req, res) => {
    const datos = req.app.locals.datos;
    const categorias = datos.categorias_gastos || ['Pasaje', 'Combustible', 'Mantenimiento', 'Sueldos', 'Alquiler', 'Impuestos', 'Otros'];
    res.render('agregar_gasto', { categorias });
});

export default router;
