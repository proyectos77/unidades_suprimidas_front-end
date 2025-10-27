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
  unidad_superior_jerarquicamente: null | string;
  sigla:            string;
  unidad_que_asume_archivo_unidad: null | string;
  departamento:     null |string;
  idDepartamento:   null | number;
  municipio:        null | string;
  idMunicipio:      null | number;
  estado:           null | string;
  idEstado:         number;
  id_dependencia?:  null | number; // Nuevo campo para el filtro
}

export interface InfoPagination {
  pagina:                  number;
  totalRegistro:           number;
  totalRegistrosPorPagina: number;
  totalPaginas:            number;
}
