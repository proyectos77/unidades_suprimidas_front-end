export interface RespuestaRegistroCajaUnidadActiva {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Datum[];
}

export interface Datum {
  idCajaUnidadActiva:                       number;
  idBalda:                                  number;
  codigoCajaUnidadActiva:                   string;
  numeroConsecutivoBodegaUnidadActiva:      string;
  numeroCorrelativoDependenciaUnidadActiva: string;
  anioCajaUnidadActiva:                     string;
  cantidadLibrosUnidadActiva:               string;
  cantidadCarpetasUnidadActiva:             string;
  fechaCreacionArchivoUnidadActiva:         null;
  fechaActualizacionArchivoUnidadActiva:    null;
  idEstado:                                 number;
}
