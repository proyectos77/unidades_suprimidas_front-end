export interface RespuestaUpdateUsuario {
    statusCode: number;
    titulo:     string;
    mensaje:    string;
    icono:      string;
    data:       Data;
}

export interface Data {
    id_usuario:                  number;
    nombre_usuario:              string;
    identificacion_usuario:      string;
    email_usuario:               string;
    user_usuario:                string;
    id_tipo_usuario:             number;
    id_cargo:                    number;
    fecha_creacion_usuario:      Date;
    fecha_actualizacion_usuario: Date;
    id_estado:                   number;
}
