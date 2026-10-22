import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.staging';
import { HttpClient } from '@angular/common/http';
import { RegistroDocumentacionSistema } from '../interfaces/registro-documentacion-sistema';
import { Observable } from 'rxjs';
import { GetAllDocumentacionSistema } from '../interfaces/get-all-documentacion-sistema';

@Injectable({
  providedIn: 'root'
})
export class ManualesInformacionServiceService {

  public url: string = environment.apiUrl + "/documentacionSistema";

  constructor(private http: HttpClient) { }

  registroDocumentacion(data: RegistroDocumentacionSistema): Observable<RegistroDocumentacionSistema> {
      return this.http.post<RegistroDocumentacionSistema>(this.url, data);
  }

  getAllDocumentacionSistema(): Observable<GetAllDocumentacionSistema> {
      return this.http.get<GetAllDocumentacionSistema>(this.url);
  }

}
