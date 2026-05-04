export interface GetInfoCarpeta {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Data;
}

export interface Data {
  carpeta:            number;
  nombreSerie:        string;
  nombreSubserie:     string;
  numeroCarpeta:      string;
  fechaExtremaInicio: Date;
  fechaExtremaFin:    Date;
  cantidadFolios:     string;
}
