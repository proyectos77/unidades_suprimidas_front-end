export interface GetTiposDocumentales {
  statusCode: number;
  titulo: string;
  mensaje: string;
  icono: string;
  data: TipoDocumental[];
}

export interface TipoDocumental {
  id_tipo_documental: number;
  nombre_tipo_documental: string;
}
