import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.staging';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListadoUnidadesConArchivo } from '../interfaces/listado-unidades-con-archivo';
import { LsitadoArchivoPorUnidad } from '../interfaces/lsitado-archivo-por-unidad';
import { RespuestaRegistroSolicitudTransferencia } from '../interfaces/respuesta-registro-solicitud-transferencia';
import { StoreSolicitudTransferencia } from '../interfaces/store-solicitud-transferencia';
import { ListadoSolicitudesTransferencias } from '../interfaces/listado-solicitudes-transferencias';
import ListadoSolicitudesTransferenciasComponent from '../pages/listado-solicitudes-transferencias/listado-solicitudes-transferencias.component';

@Injectable({
  providedIn: 'root'
})
export class TransferenciasService {

    public url: string = environment.apiUrl;
    constructor(
        private http: HttpClient
    ) { }

    getAllUnidadesConArchivo():Observable<ListadoUnidadesConArchivo>{
        let urlFinal = this.url + '/selectUnidadesArchivo';
        return this.http.get<ListadoUnidadesConArchivo>(urlFinal);
    }

    getAllArchivoPorUnidad(idDetalleUnidad: number):Observable<LsitadoArchivoPorUnidad>{
        let urlFinal = this.url + '/selectArchivoPorUnidad/' + idDetalleUnidad;
        return this.http.get<LsitadoArchivoPorUnidad>(urlFinal);
    }

    storeSolicitudTransferencia(data: FormData):Observable<RespuestaRegistroSolicitudTransferencia>{
        let urlFinal = this.url + '/transferencia';
        return this.http.post<RespuestaRegistroSolicitudTransferencia>(urlFinal, data);
    }

    getAllSolicitudesTransferencias(pagina: number):Observable<ListadoSolicitudesTransferencias>{
        let urlFinal = this.url + '/solicitudesTransferencias/?page='+pagina;
        return this.http.get<ListadoSolicitudesTransferencias>(urlFinal);
    }

}
