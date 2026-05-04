export interface GetInfoCaja {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Datum;
}

export interface Datum {
  caja:                         number;
  codigoCaja:                   string;
  numeroConsecutivoBodega:      string;
  numeroCorrelativoDependencia: string;
  anioCaja:                     string;
  cantidadLibros:               string;
  cantidadCarpetas:             string;
  nombreCuerpo?:                string;
  nombreEstante?:               string;
  nombreBalda?:                 string;
  // Lowercase versions for production API compatibility
  nombrecuerpo?:                string;
  nombreestante?:               string;
  nombrebalda?:                 string;
}
