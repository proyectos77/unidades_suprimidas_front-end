import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransferenciasService } from '../../services/transferencias.service';
import { ListadoUnidadesConArchivo } from '../../interfaces/listado-unidades-con-archivo';
import { NgFor } from '@angular/common';
import { LsitadoArchivoPorUnidad } from '../../interfaces/lsitado-archivo-por-unidad';
import { SweetAlertService } from '../../../../Core/services/sweet-alert.service';
import { StoreSolicitudTransferencia } from '../../interfaces/store-solicitud-transferencia';

@Component({
  selector: 'app-solicitud-de-transferencia',
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './solicitud-de-transferencia.component.html',
  styleUrl: './solicitud-de-transferencia.component.css'
})
export default class SolicitudDeTransferenciaComponent implements OnInit{

    public formTransferencia!: FormGroup;
    documentos: File[] = [];
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
        private httpTransferencias: TransferenciasService,
        private sweet: SweetAlertService
    ){}

    ngOnInit(): void {
        this.listadoUnidades();
        this.formularioSolicitudTransferencia();
        this.formTransferencia.get('id_detalle_unidad')?.valueChanges.subscribe(idDetalleUnidad => {
            if (idDetalleUnidad != '') {
                this.listArchivoUnidad(idDetalleUnidad);
            }else{
                this.formTransferencia.get('id_archivo')?.reset('');
                this.limpiarListadoUnidadesConArchivo();
            }
        });
    }

    formularioSolicitudTransferencia():FormGroup{
        return (this.formTransferencia = this.form.group({
            id_detalle_unidad: ['', [Validators.required]],
            id_archivo: ['', [Validators.required]],
            cantidad_cajas: ['', [Validators.required]],
            cantidad_carpetas: ['', [Validators.required]],
            cantidad_folios: ['', [Validators.required]],
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

     onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.documentos = Array.from(input.files);
    }
  }

    validarForm():void{
        if (this.formTransferencia.invalid) {
            return Object.values(this.formTransferencia.controls).forEach((controls) => {
                controls.markAsTouched();
                this.sweet.alertaCamposInvalidosFormularios();
            });
        }

        /* let dataTransferencias = this.dataForm(); */

        const form = this.formTransferencia.value;
    const formData = new FormData();

      formData.append('id_detalle_unidad', form.id_detalle_unidad);
      formData.append('id_archivo', form.id_archivo);
      formData.append('cantidad_cajas', form.cantidad_cajas);
      formData.append('cantidad_carpetas', form.cantidad_carpetas);
      formData.append('cantidad_folios', form.cantidad_folios);

      this.documentos.forEach((file, index) => {
        formData.append('documentos[]', file);
  });

console.log(formData);

      this.registroSolicitudTransferencia(formData);
    }

    registroSolicitudTransferencia(data: FormData):void {
        this.httpTransferencias.storeSolicitudTransferencia(data).subscribe((solicitud) => {
            console.log(solicitud);

        })
    }



    dataForm(): StoreSolicitudTransferencia{
        const data = {
            ...this.formTransferencia.value
        }
        return data;
    }

    limpiarForm():void{
        this.formTransferencia.reset('');
        this.formTransferencia.get('id_detalle_unidad')?.reset('');
        this.formTransferencia.get('id_archivo')?.reset('');
        this.limpiarListadoUnidadesConArchivo
        this.listadoUnidades();
    }


    limpiarListadoUnidadesConArchivo(): void {
    this.listadoUnidadesConArchivo = {
        statusCode: 0,
        titulo: '',
        mensaje: '',
        icono: '',
        data: []
    };
}

}
