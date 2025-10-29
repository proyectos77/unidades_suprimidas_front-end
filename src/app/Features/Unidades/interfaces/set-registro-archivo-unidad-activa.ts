


export interface SetRegistroArchivoUnidadActiva {
  seccion:         string;
  serie:           number;
  subserie:        number | undefined;
  cajas:           number;
  carpetas:        number;
  otros:           number | undefined;
  descripcionOtro: string | undefined;
  tomos:           number | '';
  folios:          number;
  anioRegistro:    string;
  idUnidad:        number;
}
