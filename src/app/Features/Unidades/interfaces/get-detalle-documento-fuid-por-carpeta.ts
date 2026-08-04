export interface GetDetalleDocumentoFuidPorCarpeta {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       DetalleDocumentoFuidDatum[];
}

export interface DetalleDocumentoFuidDatum {
  id_detalle_documento_general: number;
  id_documento_general:         number;
  id_carpeta_unidad_activa:     number;
  numero_pagina:                number;
  numero_orden:                 number;
  codigo:                       string;
  nombre_serie_subserie_asunto: string;
  fecha_extrema_inicio:         string;
  fecha_extrema_fin:            string;
  numero_caja:                  string;
  numero_carpeta:                string;
  numero_tomo:                  string;
  numero_otro:                  string;
  numero_folios:                string;
  numero_soporte:                string;
  numero_frecuencia_consulta:   string;
  notas:                        string;
  id_estado:                    number;
}
