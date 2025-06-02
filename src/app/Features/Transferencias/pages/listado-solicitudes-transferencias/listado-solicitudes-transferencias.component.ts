import { Component, OnInit } from '@angular/core';
import { ListadoSolicitudesTransferencias } from '../../interfaces/listado-solicitudes-transferencias';
import { TransferenciasService } from '../../services/transferencias.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-listado-solicitudes-transferencias',
  imports: [NgFor],
  templateUrl: './listado-solicitudes-transferencias.component.html',
  styleUrl: './listado-solicitudes-transferencias.component.css'
})
export default class ListadoSolicitudesTransferenciasComponent implements OnInit{
    public solicitud: ListadoSolicitudesTransferencias = {
        statusCode: 0,
        titulo:     '',
        mensaje:    '',
        icono:      '',
        data:       []
    }

    constructor(private httpTransferencias: TransferenciasService){}

    ngOnInit(): void {
        this.listadoSolicitudes();
    }

    listadoSolicitudes():void{
        this.httpTransferencias.getAllSolicitudesTransferencias().subscribe(solicitudes =>{
            this.solicitud = solicitudes;
        });
    }


}
