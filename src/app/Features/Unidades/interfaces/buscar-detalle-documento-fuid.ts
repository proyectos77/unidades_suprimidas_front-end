import { DetalleDocumentoFuidDatum } from './get-detalle-documento-fuid-por-carpeta';

export interface GetBuscarDetalleDocumentoFuid {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       BuscarDetalleDocumentoFuidDatum[];
}

export interface BuscarDetalleDocumentoFuidDatum extends DetalleDocumentoFuidDatum {
  ubicacion: UbicacionDocumentoFuid | null;
}

export interface UbicacionDocumentoFuid {
  idUnidad:   number | null;
  idCuerpo:   number | null;
  idEstante:  number | null;
  idBalda:    number | null;
  idCaja:     number | null;
  idCarpeta:  number | null;
}
