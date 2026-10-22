
export interface GetAllDocumentacionSistema {
  statusCode:     number;
  titulo:         string;
  mensaje:        string;
  icono:          string;
  data:           Datum[];
  infoPagination: InfoPagination;
}

export interface Datum {
  id_documentacion_sistema:          number;
  nombre_documentacion_sistema:      string;
  descripcion_documentacion_sistema: string;
  id_tipo_documentacion_sistema:     number;
  ruta_documentacion_sistema:        string;
  estado_documentacion_sistema:      string;
}

export interface InfoPagination {
  pagina:                  number;
  totalRegistro:           number;
  totalRegistrosPorPagina: number;
  totalPaginas:            number;
}
