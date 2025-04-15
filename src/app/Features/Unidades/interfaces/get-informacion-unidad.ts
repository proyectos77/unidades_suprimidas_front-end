export interface GetInformacionUnidad {
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
  fecha_creacion_unidad:      Date | '';
  fecha_actualizacion_unidad: Date | '';
  id_estado:                  number;
  detalle_unidad:             DetalleUnidad;
  municipio:                  Municipio;
}

export interface DetalleUnidad {
  id_detalle:                                number;
  acto_administrativo_creacion_detalle:      string;
  acto_administrativo_desactivacion_detalle: string;
  fecha_creacion_unidad_detalle:             Date | '';
  fecha_desactivacion_unidad_detalle:        Date | '';
  puesto_mando_adelantado_detalle:           string;
  puesto_mando_atrasado_detalle:             string;
  observacion_detalle:                       string;
  id_unidad:                                 number;
  fecha_creacion_detalle:                    Date | '';
  fecha_actualizacion_detalle:               Date | '';
  id_estado:                                 number;
}

export interface Municipio {
  id_municipio:                  number;
  nombre_municipio:              string;
  id_departamento:               number;
  fecha_creacion_municipio:      Date | '';
  fecha_actualizacion_municipio: Date | '';
  id_estado:                     number;
  departamentos:                 Departamentos;
}

export interface Departamentos {
  id_departamento:                  number;
  nombre_departamento:              string;
  fecha_creacion_departamento:      Date | '';
  fecha_actualizacion_departamento: Date | '';
  id_estado:                        number;
}
