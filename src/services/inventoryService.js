import { generarCodigo, validarCodigo } from '../models/productModel.js';
import { guardarDatos } from '../config/database.js';

export function listarProductos(datos, filtroCategoria) {
    const productos = datos.productos;
    if (!filtroCategoria) return Object.entries(productos);
    return Object.entries(productos).filter(([_, info]) => info.categoria === filtroCategoria);
}

export function agregarProducto(datos, nombre, codigo, categoria, precio_usd, cantidad, unidad) {
    if (datos.productos[nombre]) throw new Error('El producto ya existe.');
    if (!codigo) codigo = generarCodigo(datos.productos);
    else if (!validarCodigo(codigo, datos.productos)) throw new Error('Código no válido o duplicado.');
    if (!datos.categorias.includes(categoria)) datos.categorias.push(categoria);
    datos.productos[nombre] = { codigo, precio_usd, cantidad, unidad, categoria };
    guardarDatos(datos);
    return datos.productos[nombre];
}

export function editarProducto(datos, nombreActual, nuevoNombre, nuevoPrecioUSD, nuevaCategoria, nuevaUnidad) {
    const producto = datos.productos[nombreActual];
    if (!producto) throw new Error('Producto no existe.');
    if (nuevoNombre && nuevoNombre !== nombreActual) {
        if (datos.productos[nuevoNombre]) throw new Error('Ya existe un producto con ese nombre.');
        datos.productos[nuevoNombre] = producto;
        delete datos.productos[nombreActual];
        nombreActual = nuevoNombre;
    }
    if (nuevoPrecioUSD !== undefined) producto.precio_usd = nuevoPrecioUSD;
    if (nuevaCategoria) {
        if (!datos.categorias.includes(nuevaCategoria)) datos.categorias.push(nuevaCategoria);
        producto.categoria = nuevaCategoria;
    }
    if (nuevaUnidad) producto.unidad = nuevaUnidad;
    guardarDatos(datos);
    return producto;
}

export function actualizarStock(datos, nombre, nuevaCantidad) {
    const producto = datos.productos[nombre];
    if (!producto) throw new Error('Producto no existe.');
    if (nuevaCantidad < 0) throw new Error('Cantidad no puede ser negativa.');
    producto.cantidad = nuevaCantidad;
    guardarDatos(datos);
}

export function eliminarProducto(datos, nombre) {
    if (!datos.productos[nombre]) throw new Error('Producto no existe.');
    const tieneTransacciones = datos.libro_diario.some(t => t.producto === nombre || t.codigo_producto === datos.productos[nombre].codigo);
    if (tieneTransacciones) throw new Error('No se puede eliminar porque tiene transacciones asociadas.');
    delete datos.productos[nombre];
    guardarDatos(datos);
}

export function buscarProducto(datos, termino) {
    const lower = termino.toLowerCase();
    const resultados = [];
    for (const [nombre, info] of Object.entries(datos.productos)) {
        if (nombre.includes(lower) || (info.codigo && info.codigo.toLowerCase().includes(lower))) {
            resultados.push({ nombre, info });
        }
    }
    return resultados;
}
