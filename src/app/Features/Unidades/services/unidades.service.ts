import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.staging';
import { HttpClient } from '@angular/common/http';
import { StoreUnidades } from '../interfaces/store-unidades';
import { Observable } from 'rxjs';
import { RespuestaRegistroUnidad } from '../interfaces/respuesta-registro-unidad';
import { GetAllUnidades } from '../interfaces/get-all-unidades';
import { RespuestaUpdateUnidad } from '../interfaces/respuesta-update-unidad';
import { GetListUnidadesSelect } from '../interfaces/get-list-unidades-select';
import { GetInformacionUnidad } from '../interfaces/get-informacion-unidad';
import { GetListUnidadesConDetalle } from '../interfaces/get-list-unidades-con-detalle';
import { GetListadoAnios } from '../interfaces/get-listado-anios';
import { ListadoArchivoPorUnidad } from '../interfaces/listado-archivo-por-unidad';

@Injectable({
  providedIn: 'root'
})
export class UnidadesService {

    private url = environment.apiUrl + '/unidades';
    private urlList = environment.apiUrl;
    constructor(private httpUnidades: HttpClient) { }


    getAllUnidades(pagina: number, idDependencia: number):Observable<GetAllUnidades>{

        let urlFinal;
        if (idDependencia == 0) {
            urlFinal =  this.url + '?page=' + pagina
        }else{
            urlFinal =  this.url + 'PorDependencia/' + idDependencia + '?page=' + pagina;
        }

        return this.httpUnidades.get<GetAllUnidades>(urlFinal);
    }

    storeUnidad(data: StoreUnidades):Observable<RespuestaRegistroUnidad>{
        return this.httpUnidades.post<RespuestaRegistroUnidad>(this.url, data);
    }

    updateUnidad(data: StoreUnidades, idUnidad: number):Observable<RespuestaUpdateUnidad>{
        let urlFinal = this.url + '/' + idUnidad;
        return this.httpUnidades.put<RespuestaUpdateUnidad>(urlFinal, data);
    }

    updateEstadoUnidad(estado: number, idUnidad: number):Observable<RespuestaRegistroUnidad>{
        let urlFinal = this.url + '/' + idUnidad;
        return this.httpUnidades.patch<RespuestaUpdateUnidad>(urlFinal, {estado:estado});
    }

    listUnidadesSelect():Observable<GetListUnidadesSelect>{
        let urlFinal = this.urlList + '/selectUnidades';
        return this.httpUnidades.get<GetListUnidadesSelect>(urlFinal);
    }

    getInformacionUnidad($id: number):Observable<GetInformacionUnidad>{
        let urlFinal = this.url + '/' + $id;
        return this.httpUnidades.get<GetInformacionUnidad>(urlFinal);
    }

    listUnidadesConDetalle():Observable<GetListUnidadesConDetalle>{
        let urlFinal = this.urlList + '/selectUnidadConDetalle';
        return this.httpUnidades.get<GetListUnidadesConDetalle>(urlFinal);
    }

    listadoAnios():Observable<GetListadoAnios>{
        let urlFinal = this.urlList + '/anios';
        return this.httpUnidades.get<GetListadoAnios>(urlFinal);
    }

    detalleArchivoPorUnidad(idDetalleUnidad:number, page: number):Observable<ListadoArchivoPorUnidad>{
        let urlFinal = this.urlList + '/archivoPorUnidad/'+idDetalleUnidad+'?page=' + page;
        return this.httpUnidades.get<ListadoArchivoPorUnidad>(urlFinal);
    }
}
