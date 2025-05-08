import { Component } from '@angular/core';
import { StoreDetalleUnidad } from '../../interfaces/sotre-detalleUnidad';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UnidadesService } from '../../services/unidades.service';
import { SweetAlertService } from '../../../../Core/services/sweet-alert.service';
import { DetalleUnidadService } from '../../services/detalleUnidad.service';
import { ArchivoDetalleUnidadService } from '../../services/archivo-detalle-unidad.service';
import { GetListUnidadesSelect } from '../../interfaces/get-list-unidades-select';
import { NgFor, NgIf } from '@angular/common';
import { GetListUnidadesConDetalle } from '../../interfaces/get-list-unidades-con-detalle';
import { GetListadoAnios } from '../../interfaces/get-listado-anios';
import { RespuestaRegistroArchivo } from '../../interfaces/respuesta-registro-archivo';
import { StoreArchivoDetalleUnidad } from '../../interfaces/store-archivo-detalle-unidad';

@Component({
  selector: 'app-registro-archivo-unidad',
  imports: [NgFor, ReactiveFormsModule],
  templateUrl: './registro-archivo-unidad.component.html',
  styleUrl: './registro-archivo-unidad.component.css',
})
export default class RegistroArchivoUnidadComponent {
    public formDetalle!: FormGroup;
    public formArchivo!: FormGroup;
    public unidadesSelect: GetListUnidadesConDetalle = {
      statusCode: 0,
      titulo: '',
      mensaje: '',
      icono: '',
      data: [],
    };

    public anios: GetListadoAnios = {
        statusCode: 0,
        data: []

    };
    constructor(
      private httUnidades: UnidadesService,
      private formulario: FormBuilder,
      private sweet: SweetAlertService,
      private httpDetalleUnidad: DetalleUnidadService,
      private httArchivo: ArchivoDetalleUnidadService
    ) {}

    ngOnInit(): void {
      this.listadoUnidadesConDetalle();
      this.formArchivo = this.formularioArchivo();
      this.listaAnios();
    }

    formularioArchivo(): FormGroup {
      return (this.formArchivo = this.formulario.group({
        id_detalle: ['', Validators.required],
        anio_registro_archivo: ['', Validators.required],
        numero_cajas: ['', Validators.required],
        numero_carpetas: ['', Validators.required],
        numero_folio: ['', Validators.required],
      }));
    }

    listadoUnidadesConDetalle(): void {
      this.httUnidades.listUnidadesConDetalle().subscribe((listadoUnidades) => {
        console.log(listadoUnidades);

        this.unidadesSelect = listadoUnidades;
      });
    }

    listaAnios(): void {
      this.httUnidades.listadoAnios().subscribe((anios) => {
          this.anios = anios;
      });
    }

    validarFormulario(): void {
        if (this.formArchivo.invalid) {
            return Object.values(this.formArchivo.controls).forEach((control) => {
                control.markAsTouched();
                this.sweet.alertaCamposInvalidosFormularios();
            });
        }

        let dataform = this.crearDataForm();
        this.registroDetalleUnidad(dataform);
    }

    crearDataForm(): StoreArchivoDetalleUnidad {
      const data = {
          ...this.formArchivo.value,
      };

      return data;
    }

    registroDetalleUnidad(data: StoreArchivoDetalleUnidad): void {
      this.httArchivo.storeArchivo(data).subscribe((detalle) => {
          console.log(detalle);

          this.sweet.alertaGeneral(detalle.icono, detalle.titulo, detalle.mensaje);
      });
    }

    limpiarForm(): void {
      this.formDetalle.reset();
      this.formDetalle.get('idUnidad')?.setValue('');
      this.formArchivo.reset();
    }
}
