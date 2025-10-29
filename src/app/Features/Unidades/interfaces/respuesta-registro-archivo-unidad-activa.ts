export interface RespuestaRegistroArchivoUnidadActiva {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Data;
}

export interface Data {
  anio_registro_archivo_unidad_activa:       string;
  seccion_archivo_unidad_activa:             string;
  id_serie:                                  string;
  id_subserie:                               string;
  cantidad_cajas_archivo_unidad_activa:      number;
  cantidad_carpetas_archivo_unidad_activa:   number;
  cantidad_tomos_archivo_unidad_activa:      number;
  cantidad_folios_archivo_unidad_activa:     number;
  cantidad_otros_archivo_unidad_activa:      number;
  descripcion_otro_archivo_unidad_activa:    string;
  id_unidad:                                 number;
  fecha_actualizacion_archivo_unidad_activa: Date;
  fecha_creacion_archivo_unidad_activa:      Date;
  id_archivo_unidad_activa:                  number;
}
