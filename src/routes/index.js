import express from 'express';
import productRoutes from './productRoutes.js';
import saleRoutes from './saleRoutes.js';
import purchaseRoutes from './purchaseRoutes.js';
import accountingRoutes from './accountingRoutes.js';
import rateRoutes from './rateRoutes.js';
import clientRoutes from './clientRoutes.js';
import authRoutes from './authRoutes.js';
import backupRoutes from './backupRoutes.js';

const router = express.Router();

// Página principal
router.get('/', (req, res) => {
    res.render('index');
});

// Rutas API
router.use('/api/productos', productRoutes);
router.use('/api/ventas', saleRoutes);
router.use('/api/compras', purchaseRoutes);
router.use('/api/contabilidad', accountingRoutes);
router.use('/api/tasas', rateRoutes);
router.use('/api/clientes', clientRoutes);
router.use('/api/auth', authRoutes);
router.use('/api/backup', backupRoutes);

// Páginas web (vistas)
router.get('/inventario', (req, res) => {
    res.render('inventario');
});

router.get('/inventario/agregar', (req, res) => {
    res.render('agregar_producto');
});

router.get('/ventas', (req, res) => {
    res.render('ventas');
});

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

router.get('/contabilidad', (req, res) => {
    res.render('contabilidad');
});

router.get('/balance', (req, res) => {
    res.render('balance');
});

export default router;
