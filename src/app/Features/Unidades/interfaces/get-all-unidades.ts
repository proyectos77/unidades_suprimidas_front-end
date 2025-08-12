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
  unidad_superior_jerarquicamente: string;
  sigla:            string;
  unidad_que_asume_archivo_unidad: string;
  departamento:     string;
  idDepartamento:   number;
  municipio:        string;
  idMunicipio:      number;
  estado:           string;
  idEstado:         number;
  id_dependencia?: number; // Nuevo campo para el filtro
}

export interface InfoPagination {
  pagina:                  number;
  totalRegistro:           number;
  totalRegistrosPorPagina: number;
  totalPaginas:            number;
}
