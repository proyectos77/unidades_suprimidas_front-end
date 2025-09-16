


export interface ListadoTransferenciasPorArchivo {
  statusCode:     number;
  titulo:         string;
  mensaje:        string;
  icono:          string;
  data:           Datum[];
  infoPagination: InfoPagination;
}

export interface Datum {
  id_transferencia:                  number;
  id_archivo:                        number;
  fecha_creacion_transferencia:      Date;
  fecha_actualizacion_transferencia: Date;
  id_estado:                         number;
  detalle_transferencias:            DetalleTransferencia[];
}

export interface DetalleTransferencia {
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
}

export interface Serie {
  id_serie:          number;
  nombre_serie:      string;
  codigo_serie:      number;
  anio_inicio_serie: number;
  anio_fin_serie:    number;
  id_estado:         number;
}

export interface Subserie {
  id_subserie:     number;
  codigo_subserie: number;
  nombre_subserie: string;
  id_serie:        number;
  id_estado:       number;
}

export interface InfoPagination {
  pagina:                  number;
  totalRegistro:           number;
  totalRegistrosPorPagina: number;
  totalPaginas:            number;
}
