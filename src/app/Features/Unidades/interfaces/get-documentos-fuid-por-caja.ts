export interface GetDocumentosFuidPorCaja {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       DocumentoFuidCajaDatum[];
}

export interface DocumentoFuidCajaDatum {
  id_documento_general:        number;
  id_caja_unidad_activa:       number;
  nombre_documento_general:    string;
  url_documento:               string;
  id_estado:                   number;
}
