export interface RespuestaRegistroDocumentosUnidadActiva {
  statusCode: number;
  titulo: string;
  mensaje: string;
  icono: string;
  data: DocumentoRegistradoUnidadActiva[];
}

export interface DocumentoRegistradoUnidadActiva {
  id_carpeta_unidad_activa: number;
  numero_radicado: string;
  fecha_elaboracion: string;
  id_unidad: number;
  nombre_funcionario_destino: string;
  asunto: string;
  nombre_quien_firma: string;
  cargo_quien_firma: string;
  tipo_soporte: string;
  cantidad_folios: number;
  tipo_documental: string;
  observaciones: string;
  id_estado: number;
  id_unidad_activa: number;
}
