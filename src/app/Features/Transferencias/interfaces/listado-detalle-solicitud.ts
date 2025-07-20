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
