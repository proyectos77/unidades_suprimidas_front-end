import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.staging';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListadoUnidadesConArchivo } from '../interfaces/listado-unidades-con-archivo';

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
}
