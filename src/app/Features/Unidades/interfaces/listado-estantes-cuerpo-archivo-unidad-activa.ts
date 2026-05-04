export interface ListadoEstantesCuerpoArchivoUnidadActiva {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Datum[];
}

export interface Datum {
  id_estante:     number;
  nombre_estante: string;
  id_cuerpo:      number;
}
