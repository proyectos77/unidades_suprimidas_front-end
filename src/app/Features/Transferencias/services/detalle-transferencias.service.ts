import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.staging';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListadoDetalleSolicitud } from '../interfaces/listado-detalle-solicitud';
import { ListadoDocumentosDetalle } from '../interfaces/listado-documentos-detalle';
import { InformacionDocumento } from '../interfaces/informacion-documento';
import { RespuestaUpdateDetalleTransferencia } from '../interfaces/respuesta-update-detalle-transferencia';
import { DataUpdateDetalleTransferencia } from '../interfaces/data-update-detalle-transferencia';

@Injectable({
  providedIn: 'root'
})
export class DetalleTransferenciasService {

  private url: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  listadoDetalleTransferencia(idTransferencia: number):Observable<ListadoDetalleSolicitud>{
      let urlFinal = this.url + '/detalleTransferencia/' + idTransferencia;
      return this.http.get<ListadoDetalleSolicitud>(urlFinal);
  }

  listadoDocumentosDetalle(idTransferencia: number):Observable<ListadoDocumentosDetalle>{
      let urlFinal = this.url + '/documentosTransferencia/' + idTransferencia
      return this.http.get<ListadoDocumentosDetalle>(urlFinal);
  }

  verDocumento(idDocumento: number):Observable<InformacionDocumento>{
      let urlFinal = this.url + '/documento/' + idDocumento;
      return this.http.get<InformacionDocumento>(urlFinal);
  }

  setUpdateDetalleTransferencia(idDetalleTransferencia: number, data: DataUpdateDetalleTransferencia):Observable<RespuestaUpdateDetalleTransferencia>{
      let urlFinal = this.url + '/detalleTransferencia/' + idDetalleTransferencia;
      return this.http.put<RespuestaUpdateDetalleTransferencia>(urlFinal, data);
  }

  deleteDetalleTransferencia(id: number): Observable<any> {
      let urlFinal = this.url + '/detalleTransferencia/' + id;
      return this.http.patch<any>(urlFinal, { estado: 2 });
  }
}
