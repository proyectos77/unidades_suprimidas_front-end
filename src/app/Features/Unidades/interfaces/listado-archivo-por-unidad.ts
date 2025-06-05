

export interface ListadoArchivoPorUnidad {
  statusCode:     number;
  titulo:         string;
  mensaje:        string;
  icono:          string;
  data:           Datum[];
  infoPagination: InfoPagination;
}

export interface Datum {
  id_archivo:                      number;
  anio_registro_archivo:           string;
  numero_cajas_archivos:           number;
  numero_carpetas_archivo:         number;
  numero_folios_archivo:           number;
  numero_tomos_archivo:            number;
  numero_otros_archivo:            number;
  cantidad_cajas_transferencia:    number;
  cantidad_carpetas_transferencia: number;
  cantidad_folios_transferencia:   number;
  porcentaje_transferencia:        number;
  cantidad_tomos_transferencia:    number;
  cantidad_otros_transferencia:    number;
  cantidad_cajas_faltante:         number;
  cantidad_carpetas_faltante:      number;
  cantidad_folios_faltante:        number;
  porcentaje_faltante:             number;
  cantidad_tomos_faltante:         number;
  cantidad_otros_faltante:         number;
}

export interface InfoPagination {
  pagina:                  number;
  totalRegistro:           number;
  totalRegistrosPorPagina: number;
  totalPaginas:            number;
}
