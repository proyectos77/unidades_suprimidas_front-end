import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { SweetAlertService } from '../services/sweet-alert.service';
import { log } from 'node:console';


export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('token');
  const sweet = inject(SweetAlertService); // Para mostrar la alerta

  const request = token && ['POST', 'PUT', 'PATCH', 'GET'].includes(req.method)
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(request).pipe(
    catchError((error) => {
      const err = error?.error;
      console.log(err.statusCode);

      if (err && err.statusCode && err.mensaje) {

          if (err.statusCode === 401) {
              sweet.alertaGeneral(err.icono || 'error', err.titulo || 'Error', err.mensaje);
              window.location.href = '/login';
          }else if (err.statusCode === 404) {
              sweet.alertaGeneral(err.icono || 'error', err.titulo || 'Error', err.mensaje);
          }else if (err.statusCode === 422) {
              sweet.alertaGeneral(err.icono || 'error', err.titulo || 'Error', err.mensaje);
          }
      } else {
          sweet.alertaGeneral('error', 'Error desconocido', 'Ocurrió un error inesperado');
      }
      return throwError(() => err); // Lo relanzas para que el componente también lo reciba si es necesario
    })
  );
};
