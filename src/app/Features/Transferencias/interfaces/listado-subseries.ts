export interface ListadoSubseries {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Datum[];
}

export interface Datum {
  id_subserie:                  number;
  codigo_subserie:              number;
  nombre_subserie:              string;
  id_serie:                     number;
  fecha_creacion_subserie:      Date;
  fecha_actualizacion_subserie: Date;
  id_estado:                    number;
}
