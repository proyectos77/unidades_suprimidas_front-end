export interface StoreDataFuid {
  id_documento_general?:        number;
  id_carpeta_unidad_activa:     number;
  numero_pagina?:               number;
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
  id_estado:                    number;
}
