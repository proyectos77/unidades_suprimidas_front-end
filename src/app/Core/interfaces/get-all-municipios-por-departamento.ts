export interface GetAllMunicipiosPorDepartamento {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Datum[];
}

export interface Datum {
  id_municipio:     number;
  nombre_municipio: string;
}
