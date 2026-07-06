export function obtenerTasaVigente(tasas) {
    for (const [nombre, info] of Object.entries(tasas)) {
        if (info.valor > 0) return { nombre, valor: info.valor };
    }
    return null;
}

export function actualizarTasa(tasas, historico, nombre, valor, fecha) {
    tasas[nombre] = { valor, ultima_actualizacion: fecha };
    historico.push({ nombre, valor, fecha });
}

export function resetTasasDiario(tasas) {
    const ahora = new Date();
    const hoy4am = new Date(ahora);
    hoy4am.setHours(4, 0, 0, 0);
    for (const info of Object.values(tasas)) {
        if (info.valor !== 0 && info.ultima_actualizacion) {
            const ultima = new Date(info.ultima_actualizacion);
            if (ultima < hoy4am) {
                info.valor = 0;
            }
        }
    }
}
