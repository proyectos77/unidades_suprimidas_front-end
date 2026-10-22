export interface GetVigenciasAprobadas {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       VigenciaAprobada[];
}

export interface VigenciaAprobada {
  idArchivo:            number;
  anio:                 string;
  cajasTransferidas:    number;
  carpetasTransferidas: number;
  foliosTransferidos:   number;
  cajasOrganizadas:     number;
  carpetasOrganizadas:  number;
}

export interface GetSeriesTransferidas {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       SerieTransferida[];
}

export interface SerieTransferida {
  id_serie:     number;
  nombre_serie: string;
  subseries:    { id_subserie: number; nombre_subserie: string }[];
}
