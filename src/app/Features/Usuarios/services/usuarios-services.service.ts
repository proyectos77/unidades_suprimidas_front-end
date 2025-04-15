import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetAllUsuarios } from '../interfaces/get-all-usuarios';
import { environment } from '../../../../environment/environment.staging';
import { StoreUsuarios } from '../interfaces/store-usuarios';
import { RespuestaRegistroUsuario } from '../interfaces/respuesta-registro-usuario';
import { RespuestaUpdateUsuario } from '../interfaces/respuesta-update-usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosServicesService {

    public url: string = environment.apiUrl + '/usuarios';

    constructor(private httpUsuarios: HttpClient) { }

    consultaListaUsuarios(pagina:number):Observable<GetAllUsuarios>{
        let urlFinal = this.url + '?page=' + pagina;
        return this.httpUsuarios.get<GetAllUsuarios>(urlFinal);
    }

    registrarUsuario(data: StoreUsuarios):Observable<RespuestaRegistroUsuario>{
        return this.httpUsuarios.post<RespuestaRegistroUsuario>(this.url, data);
    }

    updateUsuarios(data: StoreUsuarios, idUsuario: number):Observable<RespuestaUpdateUsuario>{
        let urlFinal = this.url + '/' + idUsuario;
        return this.httpUsuarios.patch<RespuestaUpdateUsuario>(urlFinal, data);
    }

    /* updateUsuario(data: StoreUsuarios):Observable */

}
