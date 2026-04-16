import { ChangeDetectorRef, Component, inject, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { UnidadesService } from '../../services/unidades.service';
import { GetListadoAnios } from '../../interfaces/get-listado-anios';
import { log } from 'console';
import { NgFor, NgIf } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { SweetAlertService } from '../../../../Core/services/sweet-alert.service';
import { StoreArchivoDetalleUnidad } from '../../interfaces/store-archivo-detalle-unidad';
import { ArchivoDetalleUnidadService } from '../../services/archivo-detalle-unidad.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-registro-anio-archivo-unidad-activa',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './registro-anio-archivo-unidad-activa.component.html',
  styleUrl: './registro-anio-archivo-unidad-activa.component.css'
})
export class RegistroAnioArchivoUnidadActivaComponent implements OnInit, OnDestroy {


    @Input() idDetalleUnidad!: number | null;
    public formularioAnioArchivo!: FormGroup;
    public anios: GetListadoAnios = {
        statusCode: 0,
        data: []
    };
    private destroy$ = new Subject<void>();
    public campoAcumulado: boolean = false;
    private idDetalle: number = 0;
    private modalInstance: Modal | null = null;
    private cdr = inject(ChangeDetectorRef);

    constructor(
      private form: FormBuilder,
      public httpUnidades: UnidadesService,
      private sweet: SweetAlertService,
      private httpArchivo: ArchivoDetalleUnidadService
    ) { }

    ngOnInit(): void{
        this.formularioAnioArchivo = this.formulario();
        this.listaAnios();
        this.escucharCambiosAnioArchivo();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

     listaAnios(): void {
        this.httpUnidades.listadoAnios().subscribe({
            next: (anioRegistro) => {
                this.anios = anioRegistro;
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Error cargando años:', error);
            }
        });
    }

    formulario():FormGroup{
        return this.form.group({
            anio_registro_archivo: ['', Validators['required']],
            numero_cajas: ['', Validators['required']],
            numero_carpetas: ['', Validators['required']],
            numero_folio: ['', Validators['required']],
            otros: [''],
            tomos: [''],
            acumuladoVigenciasCajas: ['']
        });
    }

    escucharCambiosAnioArchivo(): void {
        this.formularioAnioArchivo.get('anio_registro_archivo')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((anio) => {
            const anioSeleccionado = this.formularioAnioArchivo.get('anio_registro_archivo')?.value;
            if (anioSeleccionado == 2010 || anioSeleccionado < 2010) {
                this.campoAcumulado = true;
            } else {
                this.campoAcumulado = false;
            }
        });
    }


    validarFormulario():void{
        console.log('validarFormulario - idDetalleUnidad:', this.idDetalleUnidad);

        if (this.formularioAnioArchivo.invalid) {
            return Object.values(this.formularioAnioArchivo.controls).forEach(control => {
                control.markAsTouched();
                this.sweet.alertaCamposInvalidosFormularios();
            });
        }

        let dataForm = this.createDataForm();
        this.registroAnioUnidad(dataForm);
    }

    createDataForm(): StoreArchivoDetalleUnidad {
        const data = {
            ...this.formularioAnioArchivo.value,
            id_detalle: this.idDetalleUnidad
        }

        return data;
    }

    registroAnioUnidad(data: StoreArchivoDetalleUnidad):void {
        this.httpArchivo.storeArchivo(data).subscribe({
            next: (detalle) => {
                this.sweet.alertaGeneral(detalle.icono, detalle.titulo, detalle.mensaje);
            },
            error: (error) => {
                this.sweet.alertaGeneral('error', 'Error', 'Ocurrió un error al registrar el año de archivo para la unidad activa.');
            },
            complete: () => {
                this.closeModal();
            }
        });

    }


    /* (detalle) => {
          this.sweet.alertaGeneral(detalle.icono, detalle.titulo, detalle.mensaje);
          if (detalle.statusCode == 200) {
              this.closeModal();
          }
      }); */

    /* .subscribe({
          next: (informacion) => {
              if (informacion.statusCode === 200) {
                  this.informacionUnidad = informacion;
                  this.getArchivoUnidad(informacion.data.detalle_unidad?.id_detalle ?? 0, 1);
                  if (informacion.data.id_estado == 6) {
                      this.unidadSuprimida = true;
                      this.unidadActiva = false;
                  }else{
                      this.unidadSuprimida = false;
                      this.unidadActiva = true;
                  }
              }
          },
          error: (error) => {
              window.history.back();
          },
      }); */

    limpiarForm(): void {
        this.formularioAnioArchivo.reset();
        this.formularioAnioArchivo.get('id_detalle')?.setValue('');
        this.formularioAnioArchivo.get('anio_registro_archivo')?.setValue('');
    }

    closeModal():void{
        this.limpiarForm();
    }


}
