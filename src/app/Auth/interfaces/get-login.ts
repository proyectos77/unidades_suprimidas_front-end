export interface GetLogin {
  mensaje:     string;
  accessToken: string;
  token_type:  string;
  usuario:     Usuario;
}

export interface Usuario {
  id:            number;
  nombre:        string;
  email:         string;
  rol:           string;
  idTipoUsuario: number;
  idDependencia: number;
  permisos:      Permiso[];
}

export interface Permiso {
  id:     number;
  nombre: string;
}
