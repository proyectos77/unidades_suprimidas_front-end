import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetNotificaciones } from '../interfaces/get-notificaciones';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private url:string = environment.apiUrl + '/notificaciones/';

  constructor(private http: HttpClient) { }

  getNotificaciones():Observable<GetNotificaciones>{
      return this.http.get<GetNotificaciones>(this.url);
  }
}
