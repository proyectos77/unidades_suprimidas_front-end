export interface ListadoDependenciasHijas {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Datum[];
}

export interface Datum {
  id_dependencia:                  number;
  nombre_dependencia:              string;
  sigla_dependencia:               string;
  padre_dependencia:               number;
  fecha_creacion_dependencia:      Date;
  fecha_actualizacion_dependencia: Date;
  id_estado:                       number;
}
