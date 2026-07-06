export function obtenerBalance(datos) {
    const cuentas = {};
    for (const cuenta of datos.cuentas) {
        cuentas[cuenta] = 0;
    }
    for (const t of datos.libro_diario) {
        const monto = t.monto_usd;
        if (!cuentas[t.cuenta_debito]) cuentas[t.cuenta_debito] = 0;
        if (!cuentas[t.cuenta_credito]) cuentas[t.cuenta_credito] = 0;
        cuentas[t.cuenta_debito] += monto;
        cuentas[t.cuenta_credito] -= monto;
    }
    const lineas = [];
    let totalDebe = 0, totalHaber = 0;
    for (const [cuenta, saldo] of Object.entries(cuentas)) {
        let debe = 0, haber = 0;
        if (saldo > 0) {
            debe = saldo;
            totalDebe += debe;
        } else if (saldo < 0) {
            haber = -saldo;
            totalHaber += haber;
        }
        lineas.push({ cuenta, debe, haber });
    }
    return { lineas, totalDebe, totalHaber };
}

export function obtenerLibroDiarioPaginado(datos, tipoFiltro, pagina, tamano) {
    let transacciones = datos.libro_diario;
    if (tipoFiltro) {
        transacciones = transacciones.filter(t => t.tipo === tipoFiltro);
    }
    const total = transacciones.length;
    const inicio = pagina * tamano;
    const fin = Math.min(inicio + tamano, total);
    const items = transacciones.slice(inicio, fin);
    return { items, total, pagina, tamano };
}
