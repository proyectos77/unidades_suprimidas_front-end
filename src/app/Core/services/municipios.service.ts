import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment.staging';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetAllMunicipiosPorDepartamento } from '../interfaces/get-all-municipios-por-departamento';

@Injectable({
  providedIn: 'root'
})
export class MunicipiosService {

    private url: string = environment.apiUrl + '/municipios';

    constructor(private httMunicipios: HttpClient) { }

    getAllMunicipiosPorDepartamento(idDepartamento: number):Observable<GetAllMunicipiosPorDepartamento>{
        const urlFinal = this.url + '/' + idDepartamento;
        return this.httMunicipios.get<GetAllMunicipiosPorDepartamento>(urlFinal);
    }
}
