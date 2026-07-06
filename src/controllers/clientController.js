import { agregarCliente, agregarProveedor, editarCliente, editarProveedor, eliminarCliente, eliminarProveedor } from '../models/clientModel.js';
import { guardarDatos } from '../config/database.js';

export function listarClientes(req, res) {
    res.json(req.app.locals.datos.clientes);
}

export function listarProveedores(req, res) {
    res.json(req.app.locals.datos.proveedores);
}

export function crearCliente(req, res) {
    try {
        const { nombre, rif, telefono } = req.body;
        const datos = req.app.locals.datos;
        const result = agregarCliente(datos.clientes, nombre, rif, telefono, datos.ultimo_id_cliente);
        datos.ultimo_id_cliente = result.nuevoUltimoId;
        guardarDatos(datos);
        res.status(201).json({ id: result.id, ...datos.clientes[result.id] });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export function crearProveedor(req, res) {
    try {
        const { nombre, rif, telefono } = req.body;
        const datos = req.app.locals.datos;
        const result = agregarProveedor(datos.proveedores, nombre, rif, telefono, datos.ultimo_id_proveedor);
        datos.ultimo_id_proveedor = result.nuevoUltimoId;
        guardarDatos(datos);
        res.status(201).json({ id: result.id, ...datos.proveedores[result.id] });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export function eliminarClienteController(req, res) {
    try {
        const { id } = req.params;
        const datos = req.app.locals.datos;
        eliminarCliente(datos.clientes, id);
        guardarDatos(datos);
        res.json({ message: 'Cliente eliminado' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export function eliminarProveedorController(req, res) {
    try {
        const { id } = req.params;
        const datos = req.app.locals.datos;
        eliminarProveedor(datos.proveedores, id);
        guardarDatos(datos);
        res.json({ message: 'Proveedor eliminado' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
