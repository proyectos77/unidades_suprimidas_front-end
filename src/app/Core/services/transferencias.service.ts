import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment.staging';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListadoTransferenciasPorArchivo } from '../interfaces/listado-transferencias-por-archivo';
import { ListadoUnidadesPadreActivas } from '../../Features/Unidades/interfaces/listado-unidades-padre-activas';
import { LsitadoArchivoPorUnidad } from '../../Features/Transferencias/interfaces/lsitado-archivo-por-unidad';

@Injectable({
  providedIn: 'root'
})
export class TransferenciasService {

  private url: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllTransferenciasPorArchivo($idArchivo: number, pagina: number):Observable<ListadoTransferenciasPorArchivo>{
      const urlFinal = this.url + '/listadoTransferenciasPorArchivo/' + $idArchivo + '?page=' + pagina;
      return this.http.get<ListadoTransferenciasPorArchivo>(urlFinal);

  }

  getAllArchivoPorUnidad(idDetalleUnidad: number):Observable<LsitadoArchivoPorUnidad>{
      let urlFinal = this.url + '/selectArchivoPorUnidad/' + idDetalleUnidad;
      return this.http.get<LsitadoArchivoPorUnidad>(urlFinal);
  }

}
