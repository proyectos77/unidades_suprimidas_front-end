import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.staging';
import { HttpClient } from '@angular/common/http';
import { StoreUnidades } from '../interfaces/store-unidades';
import { Observable } from 'rxjs';
import { RespuestaRegistroUnidad } from '../interfaces/respuesta-registro-unidad';
import { GetAllUnidades } from '../interfaces/get-all-unidades';
import { RespuestaUpdateUnidad } from '../interfaces/respuesta-update-unidad';

@Injectable({
  providedIn: 'root'
})
export class UnidadesService {

    private url = environment.apiUrl + '/unidades';

    constructor(private httpUnidades: HttpClient) { }


    getAllUnidades(pagina: number):Observable<GetAllUnidades>{
        const urlFinal = this.url + '?page=' + pagina
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
}
