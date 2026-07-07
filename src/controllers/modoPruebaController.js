import * as modoPruebaService from '../services/modoPruebaService.js';

export function activarModoPrueba(req, res) {
    try {
        const datos = req.app.locals.datos;
        // Verificar si ya está activo
        if (modoPruebaService.estaEnModoPrueba(datos)) {
            return res.status(400).json({ 
                success: false, 
                error: 'El modo prueba ya está activo' 
            });
        }
        modoPruebaService.activarModoPrueba(datos);
        res.status(200).json({ 
            success: true, 
            message: '✅ Modo prueba activado. Todos los cambios serán simulados en memoria y se borrarán al salir.' 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export function desactivarModoPrueba(req, res) {
    try {
        const datos = req.app.locals.datos;
        if (!modoPruebaService.estaEnModoPrueba(datos)) {
            return res.status(400).json({ 
                success: false, 
                error: 'El modo prueba no está activo' 
            });
        }
        modoPruebaService.desactivarModoPrueba(datos);
        res.status(200).json({ 
            success: true, 
            message: '✅ Modo prueba desactivado. Todos los cambios realizados en modo prueba han sido eliminados. Los datos originales han sido restaurados.' 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export function estadoModoPrueba(req, res) {
    try {
        const datos = req.app.locals.datos;
        const activo = modoPruebaService.estaEnModoPrueba(datos);
        res.json({ 
            activo,
            mensaje: activo ? '⚠️ Modo prueba activo - Los cambios no se guardan' : '✅ Modo normal - Los cambios se guardan'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
