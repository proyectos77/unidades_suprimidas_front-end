
export interface RespuestaRegistroFuidGeneral {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Data;
}

export interface Data {
  numero_orden:                 number;
  codigo:                       number;
  nombre_serie_subserie_asunto: string;
  fecha_extrema_inicio:         Date;
  fecha_extrema_fin:            Date;
  numero_caja:                  string;
  numero_carpeta:               string;
  numero_tomo:                  string;
  numero_otro:                  string;
  numero_folios:                string;
  numero_soporte:               string;
  numero_frecuencia_consulta:   string;
  notas:                        string;
  url_documento:                string;
  id_estado:                    number;
  fecha_actualizacion:          Date;
  fecha_creacion:               Date;
  id_documento_general:         number;
}
