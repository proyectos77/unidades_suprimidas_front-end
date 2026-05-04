/* export interface GetDetalleEstructuraArchivoUnidadActiva {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Datum[];
}

export interface Datum {
  carpeta: number;
  caja:    number;
  balda:   number;
  estante: number;
  cuerpo:  number;
} */
export interface GetDetalleEstructuraArchivoUnidadActiva {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Datum[];
}

export interface Datum {
  id:     number;
  nombre: string;
}
