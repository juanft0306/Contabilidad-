import { guardarDatos, setModoPruebaActivo, isModoPruebaActivo } from '../config/database.js';
import { inicializarDatos } from '../models/dataModel.js';

/**
 * Activa el modo prueba guardando una copia de los datos actuales.
 */
export function activarModoPrueba(datos) {
    if (isModoPruebaActivo()) {
        throw new Error('El modo prueba ya está activo');
    }
    // Guardar copia de seguridad de los datos actuales
    datos.datos_prueba = JSON.parse(JSON.stringify(datos));
    // Limpiar datos para empezar desde cero en modo prueba
    const datosNuevos = inicializarDatos();
    // Copiar solo la configuración de empresa y tasas (opcional)
    datosNuevos.config_empresa = datos.config_empresa;
    datosNuevos.tasas = datos.tasas;
    datosNuevos.categorias = datos.categorias;
    datosNuevos.cuentas = datos.cuentas;
    datosNuevos.modo_prueba_activo = true;
    
    // Reemplazar datos
    Object.assign(datos, datosNuevos);
    datos.modo_prueba_activo = true;
    setModoPruebaActivo(true);
    guardarDatos(datos);
    return true;
}

/**
 * Desactiva el modo prueba y restaura los datos originales.
 */
export function desactivarModoPrueba(datos) {
    if (!isModoPruebaActivo()) {
        throw new Error('El modo prueba no está activo');
    }
    if (!datos.datos_prueba) {
        throw new Error('No hay datos de respaldo para restaurar');
    }
    // Restaurar datos originales
    const datosOriginales = datos.datos_prueba;
    // Eliminar los campos de modo prueba antes de asignar
    delete datosOriginales.modo_prueba_activo;
    delete datosOriginales.datos_prueba;
    Object.assign(datos, datosOriginales);
    datos.modo_prueba_activo = false;
    datos.datos_prueba = null;
    setModoPruebaActivo(false);
    guardarDatos(datos);
    return true;
}

/**
 * Verifica si el modo prueba está activo.
 */
export function estaEnModoPrueba(datos) {
    return datos.modo_prueba_activo || false;
}
