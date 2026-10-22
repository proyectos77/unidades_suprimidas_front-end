import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment.staging';
import { GetSeriesTransferidas, GetVigenciasAprobadas } from '../interfaces/organizacion-transferencia';
import { StoreCajasArchivoUnidadesActivas } from '../interfaces/store-cajas-archivo-unidades-activas';
import { RespuestaRegistroCajaUnidadActiva } from '../interfaces/respuesta-registro-caja-unidad-activa';
import { StoreCapetaUnidadActiva } from '../interfaces/store-capeta-unidad-activa';
import { RespuestaRegistroCapetaUnidadActiva } from '../interfaces/respuesta-registro-capeta-unidad-activa';

@Injectable({
  providedIn: 'root'
})
export class OrganizacionTransferenciaService {

    private url = environment.apiUrl + '/organizacionTransferencia';

    constructor(private http: HttpClient) { }

    vigenciasAprobadas(idUnidad: number): Observable<GetVigenciasAprobadas> {
        return this.http.get<GetVigenciasAprobadas>(this.url + '/vigencias/' + idUnidad);
    }

    seriesTransferidas(idUnidad: number, anio: string): Observable<GetSeriesTransferidas> {
        return this.http.get<GetSeriesTransferidas>(this.url + '/series/' + idUnidad + '/' + anio);
    }

    registrarCajas(data: StoreCajasArchivoUnidadesActivas): Observable<RespuestaRegistroCajaUnidadActiva> {
        return this.http.post<RespuestaRegistroCajaUnidadActiva>(this.url + '/cajas', data);
    }

    registrarCarpetas(data: StoreCapetaUnidadActiva): Observable<RespuestaRegistroCapetaUnidadActiva> {
        return this.http.post<RespuestaRegistroCapetaUnidadActiva>(this.url + '/carpetas', data);
    }
}
