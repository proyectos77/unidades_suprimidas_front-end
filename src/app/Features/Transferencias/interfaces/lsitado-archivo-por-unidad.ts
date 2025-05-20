export interface LsitadoArchivoPorUnidad {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Datum[];
}

export interface Datum {
  anio:       string;
  id_archivo: number;
}
