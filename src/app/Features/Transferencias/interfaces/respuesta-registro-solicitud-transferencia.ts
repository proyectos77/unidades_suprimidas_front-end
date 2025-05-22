
export interface RespuestaRegistroSolicitudTransferencia {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Datum[];
}

export interface Datum {
  nombre_documento:    string;
  url_documento:       string;
  extension_documento: string;
  id_documento:        number;
}
