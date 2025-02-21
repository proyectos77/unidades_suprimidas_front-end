export interface GetLogin {
    mensaje:     string;
    accessToken: string;
    token_type:  string;
    usuario:     Usuario;
}

export interface Usuario {
  id:     number;
  nombre: string;
  email:  string;
}
