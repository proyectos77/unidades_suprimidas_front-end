export interface ListadoBaldasEstantesArchivoUnidadActiva {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Datum[];
}

export interface Datum {
  id_balda:     number;
  nombre_balda: string;
  id_estante:   number;
}
