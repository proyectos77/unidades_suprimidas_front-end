export interface GetAllListadoUnidadesActivas {
  statusCode:     number;
  titulo:         string;
  mensaje:        string;
  icono:          string;
  data:           Datum[];
  infoPagination: InfoPagination;
}

export interface Datum {
  id_unidad:                       number;
  nombre:                          string;
  unidad_superior_jerarquicamente: null | string;
  sigla:                           string;
  unidad_que_asume_archivo_unidad: null;
  departamento:                    null;
  idDepartamento:                  null;
  municipio:                       null;
  idMunicipio:                     null;
  estado:                          string;
  idEstado:                        number;
  padre_unidad:                    PadreUnidad | null;
}

/* export enum Estado {
  Activo = "Activo",
} */

export interface PadreUnidad {
  id_unidad:     number;
  nombre_unidad: string;
}

export interface InfoPagination {
  pagina:                  number;
  totalRegistro:           number;
  totalRegistrosPorPagina: number;
  totalPaginas:            number;
}
