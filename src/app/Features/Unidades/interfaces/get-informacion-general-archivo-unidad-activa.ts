export interface GetInformacionGeneralArchivoUnidadActiva {
    statusCode: number;
    titulo:     string;
    mensaje:    string;
    icono:      string;
    data:       Data;
}

export interface Data {
    id_archivo_unidad_activa:                  number;
    id_unidad:                                 number;
    ubicacion_archivo_unidad_activa:           string;
    direccion_archivo_unidad_activa:           string;
    edificio_archivo_unidad_activa:            string;
    piso_archivo_unidad_activa:                string;
    bodega_archivo_unidad_activa:              string;
    fecha_creacion_archivo_unidad_activa:      Date;
    fecha_actualizacion_archivo_unidad_activa: Date;
    id_estado:                                 number;
}
