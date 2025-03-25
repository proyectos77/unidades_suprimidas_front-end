import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment.staging';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MunicipiosService {

    private url: string = environment.apiUrl + '/municipios';

    constructor(private httMunicipios: HttpClient) { }

    getAllMunicipiosPorDepartamento(idDepartamento: number):Observable<>{

    }
}
