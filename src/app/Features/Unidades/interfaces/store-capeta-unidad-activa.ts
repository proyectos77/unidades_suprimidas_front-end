import { Serie } from '../../../Core/interfaces/listado-transferencias-por-archivo';
export interface StoreCapetaUnidadActiva {
  carpetas: Carpeta[];
}

export interface Carpeta {
  cajaUnidadActiva:   number;
  nombreCaja:        string;
  serie:             number;
  subserie:           number;
  numeroCarpeta:      string;
  fechaExtremaInicio: Date;
  fechaExtremaFin:    Date;
  cantidadFolios:     string;
}
