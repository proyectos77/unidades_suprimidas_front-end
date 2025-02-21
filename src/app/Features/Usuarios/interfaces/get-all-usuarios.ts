export interface GetAllUsuarios {
  statusCode:     number;
  titulo:         string;
  mensaje:        string;
  icono:          string;
  data:           DatumUsuario[];
  infoPagination: InfoPagination;
}

export interface DatumUsuario {
  id:             number;
  nombre:         string;
  identificacion: number;
  email:          string;
  usuario:        string;
  estado:         string;
  cargo:          string;
  tipoUsuario:    string;
}

export interface InfoPagination {
  pagina:                  number;
  totalRegistro:           number;
  totalRegistrosPorPagina: number;
  totalPaginas:            number;
}
