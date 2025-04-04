export interface GetListUnidadesSelect {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Datum[];
}

export interface Datum {
  id_unidad: number;
  nombre:    string;
}
