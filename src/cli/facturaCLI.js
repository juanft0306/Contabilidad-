import { cprint, limpiarPantalla, pausa } from '../utils/helpers.js';

export async function menuFacturas(datos) {
    limpiarPantalla();
    cprint('--- FACTURAS ---', '\x1b[36m', true);
    if (datos.facturas.length === 0) {
        console.log('No hay facturas.');
        await pausa();
        return;
    }
    for (const f of datos.facturas.slice(-5)) {
        console.log(`${f.numero} - ${f.fecha} - ${f.cliente.nombre} - $${f.total_usd.toFixed(2)}`);
    }
    console.log('Mostrando últimas 5 facturas.');
    await pausa();
}
