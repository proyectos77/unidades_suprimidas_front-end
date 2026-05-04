import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment.staging';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListadoSeries } from '../../Features/Transferencias/interfaces/listado-series';
import { ListadoSubseries } from '../../Features/Transferencias/interfaces/listado-subseries';

@Injectable({
  providedIn: 'root'
})
export class SeriesSubseriesService {
  public url: String = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getListadoSeries(anio: string):Observable<ListadoSeries>{
      let urlFinal = this.url + '/series/' + anio;
      return this.http.get<ListadoSeries>(urlFinal);
  }

  getListadoSubseries(idSerie: number):Observable<ListadoSubseries>{
      let urlFinal = this.url + '/subseries/' + idSerie;
      return this.http.get<ListadoSubseries>(urlFinal);
  }

}
