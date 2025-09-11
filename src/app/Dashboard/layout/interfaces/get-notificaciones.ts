
export interface GetNotificaciones {
  statusCode: number;
  titulo:     string;
  mensaje:    string;
  icono:      string;
  data:       Data;
}

export interface Data {
  total_hoy:    number;
  total_semana: number;
  total_mes:    number;
}
