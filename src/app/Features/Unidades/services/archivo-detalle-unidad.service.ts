import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.staging';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RespuestaRegistroArchivo } from '../interfaces/respuesta-registro-archivo';
import { StoreArchivoDetalleUnidad } from '../interfaces/store-archivo-detalle-unidad';
import { RespuestaActualizacionArchivo } from '../interfaces/respuesta-actualizacion-archivo';
import { StoreActualizarArchivoRegistrado } from '../interfaces/store-actualizar-archivo-registrado';

@Injectable({
  providedIn: 'root'
})
export class ArchivoDetalleUnidadService {

  private url: string = environment.apiUrl + "/registroArchivo";

  constructor(private httpArchivo: HttpClient) { }

  storeArchivo(data: StoreArchivoDetalleUnidad):Observable<RespuestaRegistroArchivo>{
      return this.httpArchivo.post<RespuestaRegistroArchivo>(this.url, data);
  }

  updateArchivo(data: StoreActualizarArchivoRegistrado, idArchivoRegistrado: number):Observable<RespuestaActualizacionArchivo>{
      let urlFinal = this.url + '/' + idArchivoRegistrado;
      return this.httpArchivo.put<RespuestaActualizacionArchivo>(urlFinal, data);
  }

}
