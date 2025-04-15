export interface RespuestaUpdateUnidad {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Data;
}

export interface Data {
  id_unidad:                  number;
  nombre_unidad:              string;
  sigla_unidad:               string;
  padre_unidad:               string;
  id_municipio:               number;
  fecha_creacion_unidad:      Date;
  fecha_actualizacion_unidad: Date;
  id_estado:                  number;
}
