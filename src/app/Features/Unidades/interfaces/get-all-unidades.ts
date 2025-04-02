export interface GetAllUnidades {
  statusCode:     number;
  titulo:         string;
  mensaje:        string;
  icono:          string;
  data:           DatumUnidad[];
  infoPagination: InfoPagination;
}

export interface DatumUnidad {
  id_unidad:        number;
  nombre:           string;
  sigla:            string;
  padre:            string;
  departamento:     string;
  idDepartamento:   number;
  municipio:        string;
  idMunicipio:      number;
  estado:           string;
  idEstado:         number;
}

export interface InfoPagination {
  pagina:                  number;
  totalRegistro:           number;
  totalRegistrosPorPagina: number;
  totalPaginas:            number;
}
