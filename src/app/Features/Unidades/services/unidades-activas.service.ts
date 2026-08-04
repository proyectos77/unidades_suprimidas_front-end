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
import { StoreDataFuid } from '../interfaces/store-data-fuid';
import { RespuestaRegistroFuidGeneral } from '../interfaces/respuesta-registro-fuid-general';
import { GetDataDocumentoGeneralFuid } from '../interfaces/get-data-documento-general-fuid';

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

    storeRegistroDocumentoGeneralFuid(data: StoreDataFuid): Observable<RespuestaRegistroFuidGeneral> {
        let urlFinal = this.url + '/documentoGeneralFuid';
        return this.httpUnidades.post<RespuestaRegistroFuidGeneral>(urlFinal, data);
    }

    storeRegistroDetalleDocumentoGeneralFuid(data: StoreDataFuid): Observable<RespuestaRegistroFuidGeneral> {
        let urlFinal = this.url + '/detalleDocumentoGeneralFuid';
        return this.httpUnidades.post<RespuestaRegistroFuidGeneral>(urlFinal, data);
    }

    listadoCarpetasPorArchivoUnidadActiva(idArchivoUnidadActiva: number): Observable<RespuestaRegistroCapetaUnidadActiva> {
        let urlFinal = this.url + '/carpetasPorArchivoUnidadActiva/' + idArchivoUnidadActiva;
        return this.httpUnidades.get<RespuestaRegistroCapetaUnidadActiva>(urlFinal);
    }

    subirArchivoExcelFuid(archivo: File, idCajaUnidadActiva: number): Observable<{ statusCode: number; titulo: string; mensaje: string; icono: string; data: { id_documento_general: number; url_documento: string } }> {
        let urlFinal = this.url + '/documentoGeneralFuid/subirArchivoExcel';
        const formData = new FormData();
        formData.append('archivo_excel', archivo);
        formData.append('id_caja_unidad_activa', String(idCajaUnidadActiva));
        return this.httpUnidades.post<{ statusCode: number; titulo: string; mensaje: string; icono: string; data: { id_documento_general: number; url_documento: string } }>(urlFinal, formData);
    }

    listadoDocumentosFuidPorCarpeta(idCarpeta: number): Observable<{ statusCode: number; titulo: string; mensaje: string; icono: string; data: any[] }> {
        let urlFinal = this.url + '/documentosFuidPorCarpeta/' + idCarpeta;
        return this.httpUnidades.get<{ statusCode: number; titulo: string; mensaje: string; icono: string; data: any[] }>(urlFinal);
    }

    descargarDocumentoFuid(idDocumento: number): Observable<Blob> {
        let urlFinal = this.url + '/documentoGeneralFuid/' + idDocumento + '/descargar';
        return this.httpUnidades.get(urlFinal, { responseType: 'blob' });
    }

    obtenerUrlDescargaDocumentoFuid(idDocumento: number): string {
        return this.url + '/documentoGeneralFuid/' + idDocumento + '/descargar';
    }

  obtenerDataDocumentoGeneralFuid(idCarpeta: number): Observable<GetDataDocumentoGeneralFuid>{
      let urlFinal = this.url + '/documentoGeneralFuid/' + idCarpeta;
      return this.httpUnidades.get<GetDataDocumentoGeneralFuid>(urlFinal);
  }

}
