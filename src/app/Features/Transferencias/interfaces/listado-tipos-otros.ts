export interface ListadoTiposOtros {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Datum[];
}

export interface Datum {
  id_tipo_otro:     number;
  nombre_tipo_otro: string;
  id_estado:        number;
}
