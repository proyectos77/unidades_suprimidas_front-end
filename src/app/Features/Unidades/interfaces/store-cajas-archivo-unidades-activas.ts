
export interface StoreCajasArchivoUnidadesActivas {
    cajas: Caja[];
}

export interface Caja {
    baldas:                         number;
    archivoUnidadActiva:            number;
    codigoCaja:                     string;
    numeroConsecutivoBodega:        string;
    numeroCorrelativoDependencia:   string;
    anio:                           string;
    libros:                         string;
    carpetas:                       string;
}
