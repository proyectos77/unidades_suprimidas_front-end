export interface GetAllUnidades {
  statusCode:     number;
  titulo:         string;
  mensaje:        string;
  icono:          string;
  data:           Datum[];
  infoPagination: InfoPagination;
}

export interface Datum {
  id_unidad:    number;
  nombre:       string;
  sigla:        string;
  padre:        string;
  departamento: string;
  municipio:    string;
  estado:       string;
}

export interface InfoPagination {
  pagina:                  number;
  totalRegistro:           number;
  totalRegistrosPorPagina: number;
  totalPaginas:            number;
}
