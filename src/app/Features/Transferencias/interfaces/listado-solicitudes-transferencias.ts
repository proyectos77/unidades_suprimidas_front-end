export interface ListadoSolicitudesTransferencias {
	statusCode: number;
	titulo:     string;
	mensaje:    string;
	icono:      string;
	data:       Datum[];
}

export interface Datum {
	idSolicitudTransferencia: number;
	fechaSolicitud:           Date;
	estadoSolicitud:          string;
	estado:                   string;
	usuarioSolicita:          string;
	cantidadCajas:            number;
	cantidadCarpetas:         number;
	cantidadFolios:           number;
	porcentajeTransferencia:  string;
	anio:                     string;
	unidad:                   string;
}
