import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment.staging';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetAllDepartamentos } from '../interfaces/get-all-departamentos';

@Injectable({
  providedIn: 'root'
})
export class DepartamentosService {

    private url: string = environment.apiUrl + '/departamentos';

    constructor(private httDepartamentos: HttpClient) { }

    getAllDepartamentos():Observable<GetAllDepartamentos>{
        return this.httDepartamentos.get<GetAllDepartamentos>(this.url);
    }
}
