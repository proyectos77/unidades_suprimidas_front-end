export interface StoreDocumentosUnidadActiva {
  documentos: DocumentoUnidadActiva[];
}

export interface DocumentoUnidadActiva {
  carpetaUnidadActiva: number;
  numeroRadicado: string;
  fechaElaboracion: string;
  fechaCreacionDocumentoUnidadActiva?: string;
  fecha_creacion_documento_unidad_activa?: string;
  fechaCreacionDocumento?: string;
  fecha_creacion_documento?: string;
  unidad: number;
  nombreFuncionarioDestino: string;
  asunto: string;
  nombreQuienFirma: string;
  cargoQuienFirma: string;
  tipoSoporte: string;
  cantidadFolios: number;
  tipoDocumental: string;
  observaciones: string;
  estado: number;
  nombreCarpetaCompleta?: string;
}
