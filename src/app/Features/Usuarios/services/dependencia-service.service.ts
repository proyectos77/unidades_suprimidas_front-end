import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.staging';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListadoDependenciasPadres } from '../interfaces/listado-dependencias-padres';
import { ListadoDependenciasHijas } from '../interfaces/listado-dependencias-hijas';

@Injectable({
  providedIn: 'root'
})
export class DependenciaServiceService {

  private url = environment.apiUrl + '/dependencias';
  private urlUnidadesActivas = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getListadoUnidadesPadres():Observable<ListadoDependenciasPadres>{
      return this.http.get<ListadoDependenciasPadres>(this.url);
  }

  getListadoUnidadesHijas(idPadre: number): Observable<ListadoDependenciasHijas> {
    let urlFinal = this.url + '/' + idPadre
    return this.http.get<ListadoDependenciasHijas>(urlFinal);
  }

}
