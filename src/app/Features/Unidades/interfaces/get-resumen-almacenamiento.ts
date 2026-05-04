export interface GetResumenAlmacenamiento {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Datum[];
}

export interface Datum {
  unidad:          string;
  ubicacion:       string;
  direccion:       string;
  edificio:        string;
  piso:            string;
  bodega:          string;
  cantidadCuerpos: number;
  cantidadEstante: number;
  cantidadBaldas:  number;
  sumaCajas:       number;
  sumaCarpetas:    number;
  sumaFolios:      number;
}
