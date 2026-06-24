export interface ListadoPermisos {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Datum[];
}

export interface Datum {
  id_permiso:                  number;
  nombre_permiso:              string;
  descripcion_permiso:         string;
  fecha_creacion_permiso:      Date;
  fecha_actualizacion_permiso: Date;
  id_estado:                   number;
}
