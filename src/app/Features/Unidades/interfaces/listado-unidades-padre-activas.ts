export interface ListadoUnidadesPadreActivas {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Datum[];
}

export interface Datum {
  id_unidad:                              number;
  nombre_unidad:                          string;
  unidad_superior_jerarquicamente_unidad: null;
  sigla_unidad:                           string;
  unidad_que_asume_archivo_unidad:        null;
  id_municipio:                           null;
  id_usuario:                             null;
  padre_unidad:                           null;
  codigo_unidad_activa:                   string;
  fecha_creacion_unidad:                  Date;
  fecha_actualizacion_unidad:             Date;
  id_estado:                              number;
}
