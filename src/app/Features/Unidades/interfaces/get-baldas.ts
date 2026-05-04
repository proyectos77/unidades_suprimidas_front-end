export interface GetBaldas {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Datum[];
}

export interface Datum {
  balda: number;
  idBalda: number,
}
