export interface RespuestaUpdateDetalleTransferencia{
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Data;
}

export interface Data {
  id_detalle_transferencia:                  number;
  id_transferencia:                          number;
  seccion_detalle_transferencia:             number;
  idSerie:                                   number;
  idSubserie:                                number;
  cantidad_cajas_detalle_transferencia:      number;
  cantidad_carpetas_detalle_transferencia:   number;
  cantidad_otros_detalle_transferencia:      number;
  cantidad_folios_detalle_transferencia:     number;
  porcentaje_detalle_transferencia:          string;
  fecha_creacion_detalle_transferencia:      Date;
  fecha_actualizacion_detalle_transferencia: Date;
  id_estado:                                 number;
}
