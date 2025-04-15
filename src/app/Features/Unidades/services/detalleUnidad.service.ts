import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.staging';
import { StoreDetalleUnidad } from '../interfaces/sotre-detalleUnidad';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RepuestaRegistroDetalleUnidad } from '../interfaces/repuesta-registro-detalle-unidad';

@Injectable({
  providedIn: 'root',
})
export class DetalleUnidadService {
  private url = environment.apiUrl + '/detalleUnidad';
  constructor( private httpDetalle: HttpClient ) {}

  storeDetalleUnidad(data: StoreDetalleUnidad): Observable<RepuestaRegistroDetalleUnidad> {
      return this.httpDetalle.post<RepuestaRegistroDetalleUnidad>(this.url,data);
  }
}
