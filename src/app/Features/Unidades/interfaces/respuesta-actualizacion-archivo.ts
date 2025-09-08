export interface RespuestaActualizacionArchivo {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Data;
}

export interface Data {
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
