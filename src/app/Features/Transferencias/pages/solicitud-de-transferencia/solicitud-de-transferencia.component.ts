import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TransferenciasService } from '../../services/transferencias.service';
import { ListadoUnidadesConArchivo } from '../../interfaces/listado-unidades-con-archivo';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-solicitud-de-transferencia',
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './solicitud-de-transferencia.component.html',
  styleUrl: './solicitud-de-transferencia.component.css'
})
export default class SolicitudDeTransferenciaComponent implements OnInit{

    public formTransferencia = FormGroup;
    public listadoUnidadesConArchivo: ListadoUnidadesConArchivo = {
        statusCode: 0,
        titulo: '',
        mensaje: '',
        icono: '',
        data: []
    };

    constructor(
        private form: FormBuilder,
        private httpTransferencias: TransferenciasService
    ){}

    ngOnInit(): void {
        this.listadoUnidades();
    }

    /* formularioSolicitudTransferencia():FormGroup{
        return (this.formTransferencia = this.form.group({

        }));
    } */

    listadoUnidades():void{
        this.httpTransferencias.getAllUnidadesConArchivo().subscribe( unidades =>{
            this.listadoUnidadesConArchivo = unidades;
        });
    }

    listArchivoUnidad(idDetalleUnidad: number):void{

    }

}
