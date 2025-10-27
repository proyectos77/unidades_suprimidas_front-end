import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.staging';
import { StoreDetalleUnidad } from '../interfaces/sotre-detalleUnidad';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RepuestaRegistroDetalleUnidad } from '../interfaces/repuesta-registro-detalle-unidad';
import { RespuestaUpdateDetalleUnidad } from '../interfaces/respuesta-update-detalle-unidad';

@Injectable({
  providedIn: 'root',
})
export class DetalleUnidadService {
    private url = environment.apiUrl + '/detalleUnidad';
    constructor( private httpDetalle: HttpClient ) {}

    storeDetalleUnidad(data: StoreDetalleUnidad): Observable<RepuestaRegistroDetalleUnidad> {
        return this.httpDetalle.post<RepuestaRegistroDetalleUnidad>(this.url,data);
    }

    updateDetalleUnidad(id: number | undefined, data: StoreDetalleUnidad): Observable<RespuestaUpdateDetalleUnidad> {
        return this.httpDetalle.put<RespuestaUpdateDetalleUnidad>(`${this.url}/${id}`, data);
    }


}
