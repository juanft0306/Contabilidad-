export function agregarCliente(clientes, nombre, rif, telefono, ultimoId) {
    const id = String(ultimoId + 1);
    clientes[id] = { nombre, rif, telefono };
    return { id, nuevoUltimoId: ultimoId + 1 };
}

export function agregarProveedor(proveedores, nombre, rif, telefono, ultimoId) {
    const id = String(ultimoId + 1);
    proveedores[id] = { nombre, rif, telefono };
    return { id, nuevoUltimoId: ultimoId + 1 };
}

export function editarCliente(clientes, id, nombre, rif, telefono) {
    if (!clientes[id]) throw new Error('Cliente no existe.');
    clientes[id].nombre = nombre || clientes[id].nombre;
    clientes[id].rif = rif || clientes[id].rif;
    clientes[id].telefono = telefono || clientes[id].telefono;
}

export function editarProveedor(proveedores, id, nombre, rif, telefono) {
    if (!proveedores[id]) throw new Error('Proveedor no existe.');
    proveedores[id].nombre = nombre || proveedores[id].nombre;
    proveedores[id].rif = rif || proveedores[id].rif;
    proveedores[id].telefono = telefono || proveedores[id].telefono;
}

export function eliminarCliente(clientes, id) {
    if (!clientes[id]) throw new Error('Cliente no existe.');
    delete clientes[id];
}

export function eliminarProveedor(proveedores, id) {
    if (!proveedores[id]) throw new Error('Proveedor no existe.');
    delete proveedores[id];
}
