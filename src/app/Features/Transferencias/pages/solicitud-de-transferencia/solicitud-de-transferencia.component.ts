import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransferenciasService } from '../../services/transferencias.service';
import { ListadoUnidadesConArchivo } from '../../interfaces/listado-unidades-con-archivo';
import { NgFor } from '@angular/common';
import { LsitadoArchivoPorUnidad } from '../../interfaces/lsitado-archivo-por-unidad';

@Component({
  selector: 'app-solicitud-de-transferencia',
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './solicitud-de-transferencia.component.html',
  styleUrl: './solicitud-de-transferencia.component.css'
})
export default class SolicitudDeTransferenciaComponent implements OnInit{

    public formTransferencia!: FormGroup;
    public listadoUnidadesConArchivo: ListadoUnidadesConArchivo = {
        statusCode: 0,
        titulo: '',
        mensaje: '',
        icono: '',
        data: []
    };

    public listadoArchivoUnidad: LsitadoArchivoPorUnidad = {
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
        this.formularioSolicitudTransferencia();
        this.formTransferencia.get('id_detalle_unidad')?.valueChanges.subscribe(idDetalleUnidad => {
            this.listArchivoUnidad(idDetalleUnidad);
        });
    }

    formularioSolicitudTransferencia():FormGroup{
        return (this.formTransferencia = this.form.group({
            id_detalle_unidad: ['', [Validators.required]],
            id_archivo: ['', [Validators.required]],
            cantidadCajas: ['', [Validators.required]],
            cantidadCarpetas: ['', [Validators.required]],
            cantidadFolios: ['', [Validators.required]],
            documentos: ['', [Validators.required]]
        }));
    }

    listadoUnidades():void{
        this.httpTransferencias.getAllUnidadesConArchivo().subscribe( unidades =>{
            this.listadoUnidadesConArchivo = unidades;
        });
    }

    listArchivoUnidad(idDetalleUnidad: number):void{
        this.httpTransferencias.getAllArchivoPorUnidad(idDetalleUnidad).subscribe( archivo =>{
            this.listadoArchivoUnidad = archivo;
            console.log(archivo);

        });
    }

}
