import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransferenciasService } from '../../services/transferencias.service';
import { ListadoUnidadesConArchivo } from '../../interfaces/listado-unidades-con-archivo';
import { NgFor } from '@angular/common';
import { LsitadoArchivoPorUnidad } from '../../interfaces/lsitado-archivo-por-unidad';
import { SweetAlertService } from '../../../../Core/services/sweet-alert.service';
import { StoreSolicitudTransferencia } from '../../interfaces/store-solicitud-transferencia';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-solicitud-de-transferencia',
  standalone: true, // Se asume standalone por la importación de 'NgFor', si no es así, elimine esta línea.
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './solicitud-de-transferencia.component.html',
  styleUrl: './solicitud-de-transferencia.component.css'
})
export default class SolicitudDeTransferenciaComponent implements OnInit, OnDestroy {

    public formTransferencia!: FormGroup;
    public documentos: File[] = [];
    private destroy$ = new Subject<void>(); // Subject para gestionar la desuscripción

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
    ) {}

    ngOnInit(): void {
        this.listadoUnidades();
        this.formularioSolicitudTransferencia();
        this.escucharCambiosUnidad();
    }

    ngOnDestroy(): void {
        // Se emite un valor para que todas las suscripciones que usan takeUntil(this.destroy$) se completen y se limpien.
        this.destroy$.next();
        this.destroy$.complete();
    }

    formularioSolicitudTransferencia(): FormGroup {
        return (this.formTransferencia = this.form.group({
            id_detalle_unidad: ['', [Validators.required]],
            id_archivo: [{value: '', disabled: true}, [Validators.required]], // Deshabilitado hasta que se elija unidad
            seccion: ['', [Validators.required]],
            serie: ['', [Validators.required]],
            subserie: ['', [Validators.required]],
            cantidad_cajas: ['', [Validators.required]],
            cantidad_carpetas: ['', [Validators.required]],
            cantidad_folios: ['', [Validators.required]],
            documentos: ['', [Validators.required]],
            cantidad_otros: ['']
        }));
    }

    escucharCambiosUnidad(): void {
        this.formTransferencia.get('id_detalle_unidad')?.valueChanges
        .pipe(takeUntil(this.destroy$)) // Se desuscribe automáticamente al destruir el componente
        .subscribe(idDetalleUnidad => {
            const idArchivoControl = this.formTransferencia.get('id_archivo');
            // FIX: Se usa '&&' en lugar de '||' para una lógica correcta.
            // Una forma más simple es solo comprobar si el valor es "truthy".
            if (idDetalleUnidad) {
                idArchivoControl?.enable(); // Habilita el campo de archivo
                this.listArchivoUnidad(idDetalleUnidad);
            } else {
                idArchivoControl?.reset('');
                idArchivoControl?.disable(); // Deshabilita si no hay unidad
                this.limpiarListadoArchivoUnidad();
            }
        });
    }

    listadoUnidades(): void {
        this.httpTransferencias.getAllUnidadesConArchivo().subscribe(unidades => {
            this.listadoUnidadesConArchivo = unidades;
        });
    }

    listArchivoUnidad(idDetalleUnidad: number): void {
        this.httpTransferencias.getAllArchivoPorUnidad(idDetalleUnidad).subscribe(archivo => {
            this.listadoArchivoUnidad = archivo;
        });
    }

    seleccionDeArchivo(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            this.documentos = Array.from(input.files);
        }
    }

    validarForm(): void {
        if (this.formTransferencia.invalid) {
            // Se marca el formulario como "tocado" para mostrar errores en la UI
            this.formTransferencia.markAllAsTouched();
            this.sweet.alertaCamposInvalidosFormularios();
            return;
        }
        const data = this.dataForm();
        this.registroSolicitudTransferencia(data);
    }

    registroSolicitudTransferencia(data: FormData): void {
        this.httpTransferencias.storeSolicitudTransferencia(data).subscribe((solicitud) => {
            this.sweet.alertaGeneral(solicitud.icono, solicitud.titulo, solicitud.mensaje);
            if (solicitud.statusCode == 200) {
                this.limpiarForm();
            }
        });
    }

    dataForm(): FormData {
        const form = this.formTransferencia.value;
        const formData = new FormData();

        formData.append('id_detalle_unidad', form.id_detalle_unidad);
        formData.append('id_archivo', form.id_archivo);
        formData.append('seccion', form.seccion);
        formData.append('serie', form.serie);
        formData.append('subserie', form.subserie);
        formData.append('cantidad_cajas', form.cantidad_cajas);
        formData.append('cantidad_carpetas', form.cantidad_carpetas);
        formData.append('cantidad_folios', form.cantidad_folios);
        formData.append('cantidad_otros', form.cantidad_otros);

        this.documentos.forEach((file) => {
            formData.append('documentos[]', file);
        });

        return formData;
    }

    limpiarForm(): void {
        // FIX: Se resetea el formulario sin argumentos y se usa { emitEvent: false }
        // para evitar disparar 'valueChanges' innecesariamente.
        this.formTransferencia.reset({}, { emitEvent: false });

        // Limpiar el array de archivos manualmente
        this.documentos = [];
        // Limpiar el campo de input de archivos
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }

        this.formTransferencia.get('id_detalle_unidad')?.reset('');
        // Se limpian los listados y se asegura que el control de archivo esté deshabilitado.
        this.limpiarListadoArchivoUnidad();
        this.formTransferencia.get('id_archivo')?.disable();
    }

    limpiarListadoArchivoUnidad(): void {
        this.listadoArchivoUnidad = {
            statusCode: 0,
            titulo: '',
            mensaje: '',
            icono: '',
            data: []
        };
    }
}
