export interface RespuestaRegistroCapetaUnidadActiva {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Datum[];
}

export interface Datum {
  idCarpetaUnidadActiva:                 number;
  idCajaUnidadActiva:                    number;
  idSubserie:                            number;
  numeroCarpetaUnidadActiva:             string;
  labelJerarquico:                       string;
  fechaExtremaInicio:                    Date;
  fechaExtremaFin:                       Date;
  cantidadFolios:                        string;
  fechaCreacionCarpetaUnidadActiva:      null;
  fechaActualizacionCarpetaUnidadActiva: null;
  idEstado:                              null;
}
