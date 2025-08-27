export interface ListadoSeries {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Datum[];
}

export interface Datum {
  id_serie:                  number;
  nombre_serie:              string;
  codigo_serie:              number;
  anio_inicio_serie:         number;
  anio_fin_serie:            number;
  fecha_creacion_serie:      Date;
  fecha_actualizacion_serie: Date;
  id_estado:                 number;
}
