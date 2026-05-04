export interface GetListadoCajasArchivoUnidadActiva {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Datum[];
}

export interface Datum {
  idCajaUnidadActiva:                       number;
  idArchivoUnidadActiva:                    number;
  idBalda:                                  number;
  codigoCajaUnidadActiva:                   string;
  numeroConsecutivoBodegaUnidadActiva:      string;
  numeroCorrelativoDependenciaUnidadActiva: string;
  anioCajaUnidadActiva:                     string;
  cantidadLibrosUnidadActiva:               string;
  cantidadCarpetasUnidadActiva:             string;
  fechaCreacionArchivoUnidadActiva:         Date;
  fechaActualizacionArchivoUnidadActiva:    Date;
  idEstado:                                 number;
  nombreCuerpo?:                            string;
  nombreEstante?:                           string;
  nombreBaldà?:                             string;
  labelJerarquico?:                         string;
}
