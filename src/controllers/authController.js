import { verificarPassword, establecerPassword } from '../services/authService.js';

export function verificarAcceso(req, res) {
    const { password } = req.body;
    const datos = req.app.locals.datos;
    if (verificarPassword(datos, password)) {
        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Contraseña incorrecta' });
    }
}

export function cambiarPassword(req, res) {
    try {
        const { passwordActual, nuevaPassword } = req.body;
        const datos = req.app.locals.datos;
        if (!verificarPassword(datos, passwordActual)) {
            throw new Error('Contraseña actual incorrecta');
        }
        establecerPassword(datos, nuevaPassword);
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
