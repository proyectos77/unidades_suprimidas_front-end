export interface GetDataDocumentoGeneralFuid {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Datum[];
}

export interface Datum {
  id_documento_general:         number;
  id_carpeta_unidad_activa:     number;
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
  numero_frecuencia_consulta:   NumeroFrecuenciaConsulta;
  notas:                        Notas;
  url_documento:                URLDocumento;
  id_estado:                    number;
  estado:                       Estado;
  fecha_creacion:               Date;
  fecha_actualizacion:          Date;
}

export interface Estado {
  id_estado:                  number;
  nombre_estado:              NombreEstado;
  descripcion_estado:         DescripcionEstado;
  estado:                     string;
  fecha_creacion_estado:      Date;
  fecha_actualizacion_estado: Date;
}

export enum DescripcionEstado {
  ElementoActivo = "Elemento activo",
}

export enum NombreEstado {
  Activo = "Activo",
}

export enum Notas {
  SinNotas = "Sin notas",
}

export enum NumeroFrecuenciaConsulta {
  Baja = "Baja",
}

export enum URLDocumento {
  DocumentosFUIDFUIDPRUEBA20260723_142512Xls = "documentosFUID/FUID-PRUEBA_20260723_142512.xls",
}
