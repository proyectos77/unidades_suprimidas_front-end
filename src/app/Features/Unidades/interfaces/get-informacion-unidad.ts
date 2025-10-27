/* export interface GetInformacionUnidad {
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
  unidad_superior_jerarquicamente_unidad:               string;
  unidad_que_asume_archivo_unidad:               string;
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
  archivo:                                   Archivo;
  plan_reorganizacion_diorg_detalle: string;
}

export interface Archivo {
  id_archivo:                  number;
  numero_cajas_archivos:       number;
  numero_carpetas_archivo:     number;
  numero_folios_archivo:       number;
  id_detalle:                  number;
  fecha_creacion_archivo:      Date | '';
  fecha_actualizacion_archivo: Date | '';
  id_estado:                   number;
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
  id_departamento: number;
  nombre_departamento: string;
  fecha_creacion_departamento: Date | '';
  fecha_actualizacion_departamento: Date | '';
  id_estado: number;
} */


export interface GetInformacionUnidad {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Data;
}

export interface Data {
  id_unidad:                              number;
  nombre_unidad:                          string;
  unidad_superior_jerarquicamente_unidad: null | string;
  sigla_unidad:                           string;
  unidad_que_asume_archivo_unidad:        null | string;
  id_municipio:                           number | null;
  id_usuario:                             null;
  padre_unidad:                           number | null;
  codigo_unidad_activa:                   string;
  fecha_creacion_unidad:                  Date | '';
  fecha_actualizacion_unidad:             Date | '';
  id_estado:                              number;
  detalle_unidad?:                        DetalleUnidad;
  municipio?:                             Municipio;
  padre?:                                 Data;
}

export interface DetalleUnidad {
  id_detalle:                                number;
  acto_administrativo_creacion_detalle:      string;
  acto_administrativo_desactivacion_detalle: string;
  fecha_creacion_unidad_detalle:             Date | '';
  fecha_desactivacion_unidad_detalle:        Date | '';
  puesto_mando_adelantado_detalle:           null | string;
  puesto_mando_atrasado_detalle:             null | string;
  plan_reorganizacion_diorg_detalle:         string;
  observacion_detalle:                       string;
  id_unidad:                                 number;
  fecha_creacion_detalle:                    Date | '';
  fecha_actualizacion_detalle:               Date | '';
  id_estado:                                 number;
  archivo:                                   Archivo;
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

export interface Archivo {
  id_archivo:                  number;
  numero_cajas_archivos:       number;
  numero_carpetas_archivo:     number;
  numero_folios_archivo:       number;
  id_detalle:                  number;
  fecha_creacion_archivo:      Date | '';
  fecha_actualizacion_archivo: Date | '';
  id_estado:                   number;
}
