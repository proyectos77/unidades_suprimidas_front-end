export interface GetCarpetaConCaja {
  statusCode: number;
  titulo: string;
  mensaje: string;
  icono: string;
  data: CarpetaConCaja;
}

export interface CarpetaConCaja {
  idCarpeta: number;
  numeroCarpeta: number;
  fechaExtremaInicio: string;
  fechaExtremaFin: string;
  cantidadFolios: number;
  nombreSerie: string;
  nombreSubserie: string;
  idCaja: number;
  nombreCaja: string;
  numeroConsecutivoBodega: string;
  numeroCorrelativoDependencia: string;
  anioCaja: string;
}

export interface ListadoCarpetasConCaja {
  statusCode: number;
  titulo: string;
  mensaje: string;
  icono: string;
  data: CarpetaConCaja[];
}
