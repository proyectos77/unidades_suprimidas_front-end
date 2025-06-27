
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
  seccion_transferencia:             string;
  serie_transferencia:               string;
  subserie_transferencia:            string;
  cantidad_cajas_transferencia:      number;
  cantidad_carpetas_transferencia:   number;
  cantidad_otros_transferencia:      number;
  cantidad_folios_transferencia:     number;
  porcentaje_transferencia:          string;
  id_archivo:                        number;
  fecha_creacion_transferencia:      Date;
  fecha_actualizacion_transferencia: Date;
  id_estado:                         number;
}

export interface InfoPagination {
  pagina:                  number;
  totalRegistro:           number;
  totalRegistrosPorPagina: number;
  totalPaginas:            number;
}
