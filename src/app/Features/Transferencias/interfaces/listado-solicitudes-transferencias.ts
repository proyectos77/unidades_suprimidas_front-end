export interface ListadoSolicitudesTransferencias {
  statusCode:     number;
  titulo:         string;
  mensaje:        string;
  icono:          string;
  data:           Datum[];
  infoPagination: InfoPagination;
}

export interface Datum {
  idSolicitudTransferencia:     number;
  idTransferencia:              number;
  fechaSolicitud:               Date;
  estadoSolicitud:              string;
  idEstado:                     number
  estado:                       string;
  usuarioSolicita:              string;
  idUsuarioSolicita:            number;
  usuarioRevisor:                string;
  idUsuarioRevisor:              number;
  anio:                         string;
  unidad:                       string;
  dependencia:                  string;
  totalCajas:                   number;
  totalCarpetas:                number;
  totalFolios:                  number;
  totalPorcentajeTransferencia: number;
  totalOtros:                   number;
  secciones:                    string[];
  series:                       string[];
  subseries:                    string[];
  observacion:                  string;
}

export interface InfoPagination {
  pagina:                  number;
  totalRegistro:           number;
  totalRegistrosPorPagina: number;
  totalPaginas:            number;
}

