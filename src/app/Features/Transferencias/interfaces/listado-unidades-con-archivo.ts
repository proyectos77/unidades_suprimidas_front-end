
export interface ListadoUnidadesConArchivo {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Datum[];
}

export interface Datum {
  id_detalle_unidad: number;
  nombre_unidad:     string;
}
