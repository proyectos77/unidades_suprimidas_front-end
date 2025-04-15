export interface RepuestaRegistroDetalleUnidad {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Data;
}

export interface Data {
  acto_administrativo_creacion_detalle:      string;
  acto_administrativo_desactivacion_detalle: string;
  fecha_creacion_unidad_detalle:             string;
  fecha_desactivacion_unidad_detalle:        string;
  puesto_mando_adelantado_detalle:           string;
  puesto_mando_atrasado_detalle:             string;
  observacion_detalle:                       string;
  id_unidad:                                 number;
  id_detalle:                                number;
}
