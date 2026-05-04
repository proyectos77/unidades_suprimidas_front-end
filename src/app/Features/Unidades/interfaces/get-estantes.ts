export interface GetEstantes {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Datum[];
}

export interface Datum {
  estante: number;
  idEstante: number,
}
