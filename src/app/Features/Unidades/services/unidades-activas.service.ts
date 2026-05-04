import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.staging';
import { HttpClient } from '@angular/common/http';
import { ListadoCuerposUnidadesActivas } from '../interfaces/listado-cuerpos-unidades-activas';
import { Observable } from 'rxjs';
import { StoreInformacionGeneralArchivoUnidadACtva } from '../interfaces/store-informacion-general-archivo-unidad-actva';
import { RespuestaRegistroArchivoUnidadActiva } from '../interfaces/respuesta-registro-archivo-unidad-activa';
import { ListadoEstantesCuerpoArchivoUnidadActiva } from '../interfaces/listado-estantes-cuerpo-archivo-unidad-activa';
import { ListadoBaldasEstantesArchivoUnidadActiva } from '../interfaces/listado-baldas-estantes-archivo-unidad-activa';
import { GetListadoAnios } from '../interfaces/get-listado-anios';
import { RespuestaRegistroCajaUnidadActiva } from '../interfaces/respuesta-registro-caja-unidad-activa';
import { StoreCajasArchivoUnidadesActivas } from '../interfaces/store-cajas-archivo-unidades-activas';
import { RespuestaRegistroCapetaUnidadActiva } from '../interfaces/respuesta-registro-capeta-unidad-activa';
import { StoreCapetaUnidadActiva } from '../interfaces/store-capeta-unidad-activa';
import { GetInformacionGeneralArchivoUnidadActiva } from '../interfaces/get-informacion-general-archivo-unidad-activa';
import { GetListadoCajasArchivoUnidadActiva } from '../interfaces/get-listado-cajas-archivo-unidad-activa';
import { GetResumenAlmacenamiento } from '../interfaces/get-resumen-almacenamiento';
import { GetDetalleEstructuraArchivoUnidadActiva } from '../interfaces/get-detalle-estructura-archivo-unidad-activa';
import { GetEstantes } from '../interfaces/get-estantes';
import { GetBaldas } from '../interfaces/get-baldas';
import { GetInfoCaja } from '../interfaces/get-info-caja';
import { GetCajas } from '../interfaces/get-cajas';
import { GetCarpeta } from '../interfaces/get-carpeta';
import { GetInfoCarpeta } from '../interfaces/get-info-carpeta';

@Injectable({
  providedIn: 'root'
})
export class UnidadesActivasService {

    private url = environment.apiUrl ;
   /*  private urlUnidadesSuprimidas = environment.apiUrl + '/listadoUnidadesSuprimidas';
    private urlList = environment.apiUrl; */
    constructor(private httpUnidades: HttpClient) { }

    getInformacionGeneralArchivoUnidad(idUnidad: number):Observable<GetInformacionGeneralArchivoUnidadActiva>{
        let urlFinal = this.url + '/archivoUnidadesActivas/' + idUnidad;
        return this.httpUnidades.get<GetInformacionGeneralArchivoUnidadActiva>(urlFinal);
    }

    listadoCuerpos():Observable<ListadoCuerposUnidadesActivas>{
        let urlFinal = this.url + '/cuerpos';
        return this.httpUnidades.get<ListadoCuerposUnidadesActivas>(urlFinal);
    }

    listadoEstantes(idCuerpo: number):Observable<ListadoEstantesCuerpoArchivoUnidadActiva>{
        let urlFinal = this.url + '/estantes/' + idCuerpo;
        return this.httpUnidades.get<ListadoEstantesCuerpoArchivoUnidadActiva>(urlFinal);
    }

    listadoBaldas(idEstante: number):Observable<ListadoBaldasEstantesArchivoUnidadActiva>{
        let urlFinal = this.url + '/baldas/' + idEstante;
        return this.httpUnidades.get<ListadoBaldasEstantesArchivoUnidadActiva>(urlFinal);
    }

    storeRegistroArchivoInformacionGeneral(data: StoreInformacionGeneralArchivoUnidadACtva):Observable<RespuestaRegistroArchivoUnidadActiva>{
        let urlFinal = this.url + '/archivoUnidadesActivas';
        return this.httpUnidades.post<RespuestaRegistroArchivoUnidadActiva>(urlFinal, data);
    }

    listadoAnios():Observable<GetListadoAnios>{
        let urlFinal = this.url + '/anios';
        return this.httpUnidades.get<GetListadoAnios>(urlFinal);
    }

    sotoreRegistroCajasArchivoUnidadActiva(data: StoreCajasArchivoUnidadesActivas):Observable<RespuestaRegistroCajaUnidadActiva>{
        let urlFinal = this.url + '/cajasUnidadesActivas';
        return this.httpUnidades.post<RespuestaRegistroCajaUnidadActiva>(urlFinal, data);
    }

    storeRegistroCarpetasArchivoUnidadActiva(data: StoreCapetaUnidadActiva):Observable<RespuestaRegistroCapetaUnidadActiva>{
        let urlFinal = this.url + '/carpetasUnidadesActivas';
        return this.httpUnidades.post<RespuestaRegistroCapetaUnidadActiva>(urlFinal, data);
    }

    listadoCajas(idArchivoUnidadActiva: number):Observable<GetListadoCajasArchivoUnidadActiva>{
        let urlFinal = this.url + '/cajasPorArchivoUnidadActiva/' + idArchivoUnidadActiva;
        return this.httpUnidades.get<GetListadoCajasArchivoUnidadActiva>(urlFinal);
    }

    getResumenAlmacenamiento(idUnidad: number):Observable<GetResumenAlmacenamiento>{
        let urlFinal = this.url + '/resumenAlmacenamiento/' + idUnidad;
        return this.httpUnidades.get<GetResumenAlmacenamiento>(urlFinal);
    }

    getEstgructuraArchivoUnidadActiva(idUnidad: number):Observable<GetDetalleEstructuraArchivoUnidadActiva>{
        let urlFinal = this.url + '/detalleEstructura/' + idUnidad;
       return this.httpUnidades.get<GetDetalleEstructuraArchivoUnidadActiva>(urlFinal);
    }

    getEstantes(idUnidad: number, idCuerpo: number):Observable<GetEstantes>{
        let urlFinal = this.url + '/estantesPorCuerpo/' + idUnidad + '/' + idCuerpo;
        return this.httpUnidades.get<GetEstantes>(urlFinal);
    }

    getBaldas(idUnidad: number, idEstante: number):Observable<GetBaldas>{
        let urlFinal = this.url + '/baldasPorEstante/' + idUnidad + '/' + idEstante;
        return this.httpUnidades.get<GetBaldas>(urlFinal);
    }

    getCajasPorBaldas(idUnidad: number, idBalda: number):Observable<GetCajas>{
        let urlFinal = this.url + '/cajasPorBaldaUnidad/' + idUnidad + '/' + idBalda;
        return this.httpUnidades.get<GetCajas>(urlFinal);
    }

    infoCaja(idUnidad: number, idBalda: number):Observable<GetInfoCaja>{
        let urlFinal = this.url + '/infoCajaUnidad/' + idUnidad + '/' + idBalda;
        return this.httpUnidades.get<GetInfoCaja>(urlFinal);
    }

    GetCarpetasPorCaja(idUnidad: number, idCaja: number): Observable<GetCarpeta> {
        let urlFinal = this.url + '/carpetasPorCajaUnidad/' + idUnidad + '/' + idCaja;
        return this.httpUnidades.get<GetCarpeta>(urlFinal);
    }

    getInformacionCarpeta(idUnidad: number, idCarpeta: number): Observable<GetInfoCarpeta> {
        let urlFinal = this.url + '/infoCarpetaUnidad/' + idUnidad + '/' + idCarpeta;
        return this.httpUnidades.get<GetInfoCarpeta>(urlFinal);
    }

}
