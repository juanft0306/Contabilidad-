import * as accountingService from '../services/accountingService.js';

export function obtenerBalance(req, res) {
    const datos = req.app.locals.datos;
    const balance = accountingService.obtenerBalance(datos);
    res.json(balance);
}

export function obtenerLibroDiario(req, res) {
    const datos = req.app.locals.datos;
    const { tipo, pagina = 0, tamano = 5 } = req.query;
    const result = accountingService.obtenerLibroDiarioPaginado(datos, tipo, parseInt(pagina), parseInt(tamano));
    res.json(result);
}
