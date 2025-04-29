export interface RespuestaUpdateDetalleUnidad {
    statusCode: number;
    titulo:     string;
    mensaje:    string;
    icono:      string;
    data:       Data;
}

export interface Data {
    id_detalle:                                number;
    acto_administrativo_creacion_detalle:      string;
    acto_administrativo_desactivacion_detalle: string;
    fecha_creacion_unidad_detalle:             Date;
    fecha_desactivacion_unidad_detalle:        Date;
    puesto_mando_adelantado_detalle:           string;
    puesto_mando_atrasado_detalle:             string;
    observacion_detalle:                       string;
    id_unidad:                                 number;
    fecha_creacion_detalle:                    Date;
    fecha_actualizacion_detalle:               Date;
    id_estado:                                 number;
}
