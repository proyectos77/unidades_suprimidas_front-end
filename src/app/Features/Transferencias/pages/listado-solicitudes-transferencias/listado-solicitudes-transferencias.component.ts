import { Component, OnInit } from '@angular/core';
import { ListadoSolicitudesTransferencias } from '../../interfaces/listado-solicitudes-transferencias';
import { TransferenciasService } from '../../services/transferencias.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-listado-solicitudes-transferencias',
  imports: [NgFor, NgIf],
  templateUrl: './listado-solicitudes-transferencias.component.html',
  styleUrl: './listado-solicitudes-transferencias.component.css'
})
export default class ListadoSolicitudesTransferenciasComponent implements OnInit{
    public solicitud: ListadoSolicitudesTransferencias = {
        statusCode: 0,
        titulo:     '',
        mensaje:    '',
        icono:      '',
        data:       [],
        infoPagination: {
            pagina: 0,
            totalRegistro: 0,
            totalRegistrosPorPagina: 0,
            totalPaginas: 0
        }
    }

    public pagina:number = 1;
    public totalRegistros:number = 0;
    public registrosPorPagina:number = 0;
    public totalPaginas:number = 0;

    constructor(private httpTransferencias: TransferenciasService){}

    ngOnInit(): void {
        this.listadoSolicitudes(1);
    }

    listadoSolicitudes(pagina:number):void{
        this.httpTransferencias.getAllSolicitudesTransferencias(pagina).subscribe(solicitudes =>{
            this.solicitud = solicitudes;
        });
    }


    cambiarPagina(pagina: number):void{
        if (pagina >= 1 && pagina <= this.solicitud.infoPagination.totalPaginas) {
            this.listadoSolicitudes(pagina);
        }
    }

}
