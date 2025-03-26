export interface RespuestaRegistroUnidad {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Data;
}

export interface Data {
  nombre_unidad: string;
  sigla_unidad:  string;
  padre_unidad:  string;
  id_municipio:  number;
  id_unidad:     number;
}
