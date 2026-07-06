import * as inventoryService from '../services/inventoryService.js';

export function listarProductos(req, res) {
    const { categoria } = req.query;
    const productos = inventoryService.listarProductos(req.app.locals.datos, categoria);
    res.json(productos);
}

export function agregarProducto(req, res) {
    try {
        const { nombre, codigo, categoria, precio_usd, cantidad, unidad } = req.body;
        const datos = req.app.locals.datos;
        const producto = inventoryService.agregarProducto(datos, nombre, codigo, categoria, parseFloat(precio_usd), parseInt(cantidad), unidad);
        res.status(201).json(producto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export function eliminarProducto(req, res) {
    try {
        const { nombre } = req.params;
        const datos = req.app.locals.datos;
        inventoryService.eliminarProducto(datos, nombre);
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
