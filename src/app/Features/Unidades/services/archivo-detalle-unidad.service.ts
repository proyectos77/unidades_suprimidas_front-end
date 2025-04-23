import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.staging';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RespuestaRegistroArchivo } from '../interfaces/respuesta-registro-archivo';
import { StoreArchivoDetalleUnidad } from '../interfaces/store-archivo-detalle-unidad';

@Injectable({
  providedIn: 'root'
})
export class ArchivoDetalleUnidadService {

  private url: string = environment.apiUrl + "/registroArchivo";

  constructor(private httpArchivo: HttpClient) { }

  storeArchivo(data: StoreArchivoDetalleUnidad):Observable<RespuestaRegistroArchivo>{
      return this.httpArchivo.post<RespuestaRegistroArchivo>(this.url, data);
  }

}
