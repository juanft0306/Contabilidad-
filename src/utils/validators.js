export function validarCodigoProducto(codigo) {
    return /^[A-Z]\d{3}$/.test(codigo);
}

export function validarRIF(rif) {
    return /^[JVE]-?\d{8,9}-?\d{1}$/i.test(rif);
}
