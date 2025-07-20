export interface ListadoDocumentosDetalle {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Datum[];
}

export interface Datum {
  id_documento_transferencia: number;
  id_documento:               number;
  id_transferencia:           number;
  id_estado:                  number;
  documento:                  Documento;
}

export interface Documento {
  id_documento:                   number;
  nombre_documento:               string;
  url_documento:                  string;
  extension_documento:            string;
  tipo_documento:                 null;
  fecha_creacion_documentos:      Date;
  fecha_actualizacion_documentos: Date;
  id_estado:                      number;
}
