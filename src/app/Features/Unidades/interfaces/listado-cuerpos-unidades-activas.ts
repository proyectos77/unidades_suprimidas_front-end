export interface ListadoCuerposUnidadesActivas {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Datum[];
}

export interface Datum {
  id_cuerpo:     number;
  nombre_cuerpo: string;
}

