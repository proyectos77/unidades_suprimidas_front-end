export interface InformacionSolicitud {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Datum[];
}

export interface Datum {
  id_solicitud_transferencia:                     number;
  id_transferencia:                               number;
  fecha_inicio_solicitud_transferencia:           Date;
  id_usuario_solicitante_solicitud_transferencia: number;
  estado_solicitud_transferencia:                 number;
  id_usuario_revisor_solicitud_transferencia:     number;
  fecha_fin_solicitud_transferencia:              Date;
  observacion_solicitud_transferencia:            string;
  fecha_creacion_solicitud_transferencia:         Date;
  fecha_actualizacion_solicitud_transferencia:    Date;
  id_estado:                                      number;
}
