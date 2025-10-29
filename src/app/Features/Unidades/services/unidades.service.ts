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
import { GetAllListadoUnidadesActivas } from '../interfaces/get-all-listado-unidades-activas';
import { RespuestaRegistroArchivoUnidadActiva } from '../interfaces/respuesta-registro-archivo-unidad-activa';
import { SetRegistroArchivoUnidadActiva } from '../interfaces/set-registro-archivo-unidad-activa';
import { GetRutaUnidadActiva } from '../interfaces/get-ruta-unidad-activa';
import { ListadoUnidadesPadreActivas } from '../interfaces/listado-unidades-padre-activas';

@Injectable({
  providedIn: 'root'
})
export class UnidadesService {

    private url = environment.apiUrl + '/unidades';
    private urlUnidadesSuprimidas = environment.apiUrl + '/listadoUnidadesSuprimidas';
    private urlList = environment.apiUrl;
    constructor(private httpUnidades: HttpClient) { }


    getAllUnidades(pagina: number, idDependencia: number, filtro: string):Observable<GetAllUnidades>{

        let urlFinal;
        if (idDependencia == 0) {
            if (filtro != '') {
                urlFinal =  this.urlUnidadesSuprimidas + '/' + filtro;
            }else{
                urlFinal =  this.urlUnidadesSuprimidas + '?page=' + pagina
            }

        }else{
            if (filtro != '') {
                urlFinal =  'PorDependencia/' + idDependencia + '/' + filtro;
            }else{
                urlFinal =  this.url + '?page=' + pagina
            }
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

    listUnidadesSelect(idDependencia: number):Observable<GetListUnidadesSelect>{
        let urlFinal = this.urlList + '/selectUnidades/' + idDependencia;
        return this.httpUnidades.get<GetListUnidadesSelect>(urlFinal);
    }

    getInformacionUnidad($id: number):Observable<GetInformacionUnidad>{
        let urlFinal = this.url + '/' + $id;
        return this.httpUnidades.get<GetInformacionUnidad>(urlFinal);
    }

    listUnidadesConDetalle(idDependencia: number):Observable<GetListUnidadesConDetalle>{
        let urlFinal = this.urlList + '/selectUnidadConDetalle/' + idDependencia;
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

    busquedaPorObservacion(observacion: string, idDependencia: number):Observable<GetAllUnidades>{
        let urlFinal = this.urlList + '/observacion/' + observacion + '/idDependencia=' + idDependencia;
        return this.httpUnidades.get<GetAllUnidades>(urlFinal);
    }

    listadoUnidadesActivas(pagina: number, filtro: string, idPadre: number):Observable<GetAllListadoUnidadesActivas>{
        let urlFinal = '';
        if (filtro != '') {
          urlFinal = this.urlList + '/listadoUnidadesActivas/' + filtro;
        }else if (idPadre != 0) {
          urlFinal = this.urlList + '/listadoUnidadesActivasPorPadre/' + idPadre;
        }else{
          urlFinal = this.urlList + '/listadoUnidadesActivas?page=' + pagina;
        }

        return this.httpUnidades.get<GetAllListadoUnidadesActivas>(urlFinal);
    }

    storeRegistroArchivoUnidadActiva(data: SetRegistroArchivoUnidadActiva[]):Observable<RespuestaRegistroArchivoUnidadActiva>{
        let urlFinal = this.urlList + '/archivoUnidadesActivas';
        return this.httpUnidades.post<RespuestaRegistroArchivoUnidadActiva>(urlFinal, data);
    }

    rutaUnidadActiva(idUnidad: number):Observable<GetRutaUnidadActiva>{
        let urlFinal = this.urlList + '/rutaunidadactiva/' + idUnidad;
        return this.httpUnidades.get<GetRutaUnidadActiva>(urlFinal);
    }

    buscarPorObservacionUnidadActiva(observacion: string):Observable<GetAllListadoUnidadesActivas>{
        let urlFinal = this.urlList + '/observacionUnidadActiva/' + observacion;
        return this.httpUnidades.get<GetAllListadoUnidadesActivas>(urlFinal);
    }

    getListadoPadresUnidadesActivas():Observable<ListadoUnidadesPadreActivas>{
        let urlFinal = this.urlList + '/unidadPadreActivas';
        return this.httpUnidades.get<ListadoUnidadesPadreActivas>(urlFinal);
    }

    getListadoPadresHijasActivas(idPadre: number):Observable<ListadoUnidadesPadreActivas>{
        let urlFinal = this.urlList + '/listadoUnidadesHijasActivas/' + idPadre;
        return this.httpUnidades.get<ListadoUnidadesPadreActivas>(urlFinal);
    }

}
