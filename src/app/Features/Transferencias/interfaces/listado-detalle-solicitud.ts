/* export interface ListadoDetalleSolicitud {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Datum[];
}

export interface Datum {
  id_detalle_transferencia:                  number;
  id_transferencia:                          number;
  seccion_detalle_transferencia:             string;
  serie_detalle_transferencia:               string;
  subserie_detalle_transferencia:            string;
  cantidad_cajas_detalle_transferencia:      number;
  cantidad_carpetas_detalle_transferencia:   number;
  cantidad_otros_detalle_transferencia:      number;
  cantidad_folios_detalle_transferencia:     number;
  porcentaje_detalle_transferencia:          number;
  fecha_creacion_detalle_transferencia:      Date;
  fecha_actualizacion_detalle_transferencia: Date;
  id_estado:                                 number;
}
 */



/* export interface ListadoDetalleSolicitud {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Datum[];
}

export interface Datum {
  id_detalle_transferencia:                  number;
  id_transferencia:                          number;
  seccion_detalle_transferencia:             string;
  id_serie:                                  number;
  id_subserie:                               number;
  cantidad_cajas_detalle_transferencia:      number;
  cantidad_carpetas_detalle_transferencia:   number;
  cantidad_otros_detalle_transferencia:      number;
  cantidad_tomos_detalle_transferencia:      number;
  cantidad_folios_detalle_transferencia:     number;
  porcentaje_detalle_transferencia:          string;
  fecha_creacion_detalle_transferencia:      Date;
  fecha_actualizacion_detalle_transferencia: Date;
  id_estado:                                 number;
  serie:                                     Serie;
  subserie:                                  Subserie;
  transferencia:                             Transferencia;
}

export interface Serie {
  id_serie:                  number;
  nombre_serie:              string;
  codigo_serie:              number;
  anio_inicio_serie:         number;
  anio_fin_serie:            number;
  fecha_creacion_serie:      Date;
  fecha_actualizacion_serie: Date;
  id_estado:                 number;
}

export interface Subserie {
  id_subserie:                  number;
  codigo_subserie:              number;
  nombre_subserie:              string;
  id_serie:                     number;
  fecha_creacion_subserie:      Date;
  fecha_actualizacion_subserie: Date;
  id_estado:                    number;
}

export interface Transferencia {
  id_transferencia:                  number;
  id_archivo:                        number;
  fecha_creacion_transferencia:      Date;
  fecha_actualizacion_transferencia: Date;
  id_estado:                         number;
  archivo:                           Archivo;
}

export interface Archivo {
  id_archivo:                  number;
  numero_cajas_archivos:       number;
  numero_carpetas_archivo:     number;
  numero_folios_archivo:       number;
  numero_otros_archivo:        number;
  numero_tomos_archivo:        number;
  anio_registro_archivo:       string;
  id_detalle:                  number;
  fecha_creacion_archivo:      Date;
  fecha_actualizacion_archivo: Date;
  id_estado:                   number;
} */



export interface ListadoDetalleSolicitud {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Datum[];
}

export interface Datum {
  id_detalle_transferencia:                  number;
  id_transferencia:                          number;
  seccion_detalle_transferencia:             string;
  id_serie:                                  number;
  id_subserie:                               number;
  cantidad_cajas_detalle_transferencia:      number;
  cantidad_carpetas_detalle_transferencia:   number;
  cantidad_otros_detalle_transferencia:      number;
  cantidad_tomos_detalle_transferencia:      number;
  cantidad_folios_detalle_transferencia:     number;
  porcentaje_detalle_transferencia:          string;
  fecha_creacion_detalle_transferencia:      Date;
  fecha_actualizacion_detalle_transferencia: Date;
  id_estado:                                 number;
  serie:                                     Serie;
  subserie:                                  Subserie;
  transferencia:                             Transferencia;
}

export interface Serie {
  id_serie:                  number;
  nombre_serie:              string;
  codigo_serie:              number;
  anio_inicio_serie:         number;
  anio_fin_serie:            number;
  fecha_creacion_serie:      Date;
  fecha_actualizacion_serie: Date;
  id_estado:                 number;
}

export interface Subserie {
  id_subserie:                  number;
  codigo_subserie:              number;
  nombre_subserie:              string;
  id_serie:                     number;
  fecha_creacion_subserie:      Date;
  fecha_actualizacion_subserie: Date;
  id_estado:                    number;
}

export interface Transferencia {
  id_transferencia:                  number;
  id_archivo:                        number;
  fecha_creacion_transferencia:      Date;
  fecha_actualizacion_transferencia: Date;
  id_estado:                         number;
  archivo:                           Archivo;
  solicitudes:                       Solicitude[];
}

export interface Archivo {
  id_archivo:                  number;
  numero_cajas_archivos:       number;
  numero_carpetas_archivo:     number;
  numero_folios_archivo:       number;
  numero_otros_archivo:        null;
  numero_tomos_archivo:        null;
  anio_registro_archivo:       string;
  id_detalle:                  number;
  fecha_creacion_archivo:      Date;
  fecha_actualizacion_archivo: Date;
  id_estado:                   number;
}

export interface Solicitude {
  id_solicitud_transferencia:                     number;
  id_transferencia:                               number;
  fecha_inicio_solicitud_transferencia:           Date;
  id_usuario_solicitante_solicitud_transferencia: number;
  estado_solicitud_transferencia:                 number;
  id_usuario_revisor_solicitud_transferencia:     number;
  fecha_fin_solicitud_transferencia:              Date;
  observacion_solicitud_transferencia:            string;
  fecha_creacion_solicitud_transferencia:         Date;
  fecha_actualizacion_solicitud_transferencia:    Date;
  id_estado:                                      number;
}
