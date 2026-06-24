import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.staging';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListadoPermisos } from '../interfaces/listado-permisos';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

    private url: string = environment.apiUrl + '/permisos';

    constructor(private httpPermisos: HttpClient) { }

    public listadoPermisos():Observable<ListadoPermisos>{
        return this.httpPermisos.get<ListadoPermisos>(this.url);
    }
}
