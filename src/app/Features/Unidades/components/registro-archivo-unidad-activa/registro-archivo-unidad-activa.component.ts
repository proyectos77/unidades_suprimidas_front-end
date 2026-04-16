import { Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { ListadoTiposOtros } from '../../../Transferencias/interfaces/listado-tipos-otros';
import { ListadoUnidadesConArchivo } from '../../../Transferencias/interfaces/listado-unidades-con-archivo';
import { UnidadesService } from '../../services/unidades.service';
import { SeriesSubseriesService } from '../../../Transferencias/services/series-subseries.service';
import { ListadoSeries } from '../../../Transferencias/interfaces/listado-series';
import { ListadoSubseries } from '../../../Transferencias/interfaces/listado-subseries';
import { GetListadoAnios } from '../../interfaces/get-listado-anios';
import { Subject, takeUntil } from 'rxjs';
import { TransferenciasService } from '../../../Transferencias/services/transferencias.service';
import { error, log } from 'console';
import { SweetAlertService } from '../../../../Core/services/sweet-alert.service';
import { SetRegistroArchivoUnidadActiva } from '../../interfaces/set-registro-archivo-unidad-activa';

@Component({
  selector: 'app-registro-archivo-unidad-activa',
  imports: [ReactiveFormsModule, FormsModule, NgIf, NgFor],
  templateUrl: './registro-archivo-unidad-activa.component.html',
  styleUrl: './registro-archivo-unidad-activa.component.css'
})
export default class RegistroArchivoUnidadActivaComponent implements OnInit, OnDestroy {

    @Input() idUnidadActiva!: number;
    public formularioRegistroArchivo!:  FormGroup;
    public formularioAnioArchivo!: FormGroup;
    public detalleOtro: string = '';
    private destroy$ = new Subject<void>();
    public mostrarCantidadOtro: boolean = false;
    public otroAgregado: boolean = false;
    public solicitudesAbjuntas: SetRegistroArchivoUnidadActiva [] = [];
    public rutaUnidad: string = '';

    public anioSeleccionado: boolean = false;
    public mostrarRegistroAnioArchivo: boolean = false;

    public tiposOtros: ListadoTiposOtros ={
        statusCode: 0,
        titulo: '',
        mensaje: '',
        icono: '',
        data: []
    }
    private cantidadOtro: number = 0;
    public solicitudesLegibles: any[] = [];
    public listadoUnidadesConArchivo: ListadoUnidadesConArchivo = {
        statusCode: 0,
        titulo: '',
        mensaje: '',
        icono: '',
        data: []
    };
    public series: ListadoSeries = {
            statusCode: 0,
            titulo: '',
            mensaje: '',
            icono: '',
            data: []
        };
    public subseries: ListadoSubseries = {
        statusCode: 0,
        titulo: '',
        mensaje: '',
        icono: '',
        data: []
    };
    public anios: GetListadoAnios = {
            statusCode: 0,
            data: []
    };

    constructor(
      private form: FormBuilder,
      private httpSeriesService: SeriesSubseriesService,
      private httpUnidades: UnidadesService,
      private httpTransferencias: TransferenciasService,
      private sweet: SweetAlertService
    ) { }



    ngOnInit(): void {
    this.formularioRegistroArchivo = this.formulario();
    this.formularioAnioArchivo = this.formularioRegistroAnioArchivo(); // 👈 AQUÍ

    this.listaAnios();

    this.formularioRegistroArchivo.get('tipoOtro')?.valueChanges.subscribe((valor) => {
        if (valor) {
            this.mostrarCantidadOtro = true;
            this.formularioRegistroArchivo.get('otros')?.enable();
        } else {
            this.mostrarCantidadOtro = false;
            this.formularioRegistroArchivo.get('otros')?.disable();
        }
    });
}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['idUnidadActiva'] && changes['idUnidadActiva'].currentValue) {
          this.rutaUnidadActiva();
          this.listaAnios();
          this.escucharCambiosAnioArchivo();
          this.escucharCambioSerie();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    formulario():FormGroup{
        return this.form.group({
            seccion: [''],
            serie: [''],
            subserie: [''],
            cajas: [''],
            carpetas: [''],
            tomos: [''],
            folios: [''],
            otros: [''],
            anioRegistro: [''],
            tipoOtro: [''],
        });
    }

    formularioRegistroAnioArchivo():FormGroup{
        return this.form.group({
            anioRegistro: ['', Validators.required],
            cantidadCajas: ['', Validators.required],
            cantidadCarpetas: ['', Validators.required],
            cantidadFolios: ['', Validators.required],
            cantidadOtros: [''],
            cantidadTomos: [''],
      });
    }

    rutaUnidadActiva(): void {
        console.log('entro');

        this.httpUnidades.rutaUnidadActiva(this.idUnidadActiva).subscribe({
            next: (respuesta) => {
                console.log(respuesta);

                this.rutaUnidad = respuesta.data;
            },
            error: (error) => {
                this.sweet.alertaGeneral('error', 'Error', 'Ocurrió un error al obtener la ruta de la unidad activa.');
            },
        });
    }

    listaAnios(): void {
      this.httpUnidades.listadoAnios().subscribe((anioRegistro) => {
          this.anios = anioRegistro;
      });
    }

    escucharCambiosAnioArchivo(): void {
        this.formularioRegistroArchivo.get('anioRegistro')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((anioRegistro) => {
            const anio = this.formularioRegistroArchivo.get('anioRegistro')?.value;
            this.listadoSeries(anio);
            this.listadoOtros();
        });
    }

    escucharCambioSerie(): void {
        this.formularioRegistroArchivo.get('serie')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((idSerie) => {
            const serie = this.series.data.find(s => s.id_serie == idSerie);
            if (serie) {
                this.listadoSubseries(serie.id_serie);
            }
        });
    }

    agregarOtro(): void {
        console.log('Agregar otro llamado');
        const otroControl = this.formularioRegistroArchivo.get('tipoOtro');
        const cantidadOtroControl = this.formularioRegistroArchivo.get('otros');
        if (otroControl && cantidadOtroControl) {
            const otroId = Number(otroControl.value);
            const cantidadOtro = cantidadOtroControl.value;
            const otroObj = this.tiposOtros.data.find(o => o.id_tipo_otro === otroId);
            const nombreOtro = otroObj ? otroObj.nombre_tipo_otro : '';
            this.detalleOtro += `${nombreOtro}: ${cantidadOtro}, `;
            this.cantidadOtro += Number(cantidadOtro);
            cantidadOtroControl.reset('');
            otroControl.reset('');
        }
    }

    validarForm(): void {
        if (this.formularioRegistroArchivo.invalid) {
            this.formularioRegistroArchivo.markAllAsTouched();
            this.sweet.alertaCamposInvalidosFormularios();
            return;
        }

        this.adjuntarArchivo();
        let data  = this.createDataForm();

    }

    createDataForm(): SetRegistroArchivoUnidadActiva {
        return {
            ...this.formularioRegistroArchivo.value,
            descripcionOtro: this.detalleOtro.slice(0, -2),
            otros: (this.cantidadOtro == 0) ? undefined : this.cantidadOtro,
            idUnidad: this.idUnidadActiva
        }
    }

    listadoSeries(anio:string):void{
        this.httpSeriesService.getListadoSeries(anio).subscribe(series => {
            this.series = series;
        });
    }

    listadoSubseries(idSerie:number):void{
        this.httpSeriesService.getListadoSubseries(idSerie).subscribe(subseries => {
            if (subseries.data.length > 0) {
                this.subseries = subseries;
                this.formularioRegistroArchivo.get('subserie')?.enable();
            }else{
                this.formularioRegistroArchivo.get('subserie')?.reset('');
                this.formularioRegistroArchivo.get('subserie')?.disable();
            }
        });
    }

    listadoOtros():void{
      this.httpTransferencias.listadoTiposOtros().subscribe(otros => {
          this.tiposOtros = otros;
      });
    }

    adjuntarArchivo(): void {
                const data = this.createDataForm();


                if (data.seccion === '' || data.serie === 0 || data.cajas === 0 || data.carpetas === 0 || data.folios === 0 || data.anioRegistro === '') {
                    this.sweet.alertaGeneral('warning', 'Diligenciar los datos', 'Antes de agregar un registro diligencie los datos completos.');
                    return;
                }
                this.solicitudesAbjuntas.push(data);

                const serieId = Number(data.serie);
                const subserieId = Number(data.subserie);
                const serieObj = this.series.data.find(s => s.id_serie === serieId);
                console.log(this.series);

                const subserieObj = this.subseries.data.find(s => s.id_subserie === subserieId);

                const legible: any = {
                    id_detalle_unidad: data.idUnidad,
                    seccion: data.seccion,
                    serie: data.serie,
                    nombre_serie: serieObj ? serieObj.nombre_serie : '',
                    subserie: data.subserie == undefined ? 0 : data.subserie,
                    nombre_subserie: subserieObj ? subserieObj.nombre_subserie : '',
                    cantidad_cajas: data.cajas,
                    cantidad_carpetas: data.carpetas,
                    cantidad_folios: data.folios,
                    cantidad_otros: (this.cantidadOtro == 0) ? 0 : this.cantidadOtro,
                    cantidad_tomos: (data.tomos == '' || data.tomos == null) ? 0 : data.tomos,
                    descripcion_otro: this.detalleOtro.slice(0, -2),
                };

                this.solicitudesLegibles.push(legible);
    }

    enviarRegistros(): void {
        if (this.solicitudesAbjuntas.length === 0) {
            this.sweet.alertaGeneral('warning', 'No hay registros', 'Debe agregar al menos un registro antes de enviar.');
            return;
        }
        this.registrarArchivos();

    }

    registrarArchivos(): void {
        this.httpUnidades.storeRegistroArchivoUnidadActiva(this.solicitudesAbjuntas).subscribe({
             next: (respuesta) => {
                  this.sweet.alertaGeneral(respuesta.icono, respuesta.titulo, respuesta.mensaje);
                  this.limpiarForm();
              },
              error: (error) => {
                  this.sweet.alertaGeneral('error', 'Error', 'Ocurrió un error al registrar los archivos.');
              },


        });
    }

    limpiarForm(): void {
        this.formularioRegistroArchivo.reset({}, { emitEvent: false });
        this.detalleOtro = '';
        this.solicitudesAbjuntas = [];
        this.solicitudesLegibles = [];
        this.rutaUnidad = '';
        this.cantidadOtro = 0;
        this.mostrarCantidadOtro = false;

        this.anioSeleccionado = false;
        this.mostrarRegistroAnioArchivo = false;
    }

    limpiarCamposEspecificos() {
        this.detalleOtro = '';
        const campos = [
            'seccion',
            'serie',
            'subserie',
            'cajas',
            'carpetas',
            'folios',
            'otros',
            'tomos',
            'tipoOtro',
        ];
        campos.forEach(campo => {
            const control = this.formularioRegistroArchivo.get(campo);
            if (control) {
              control.reset('');
              control.markAsPristine();
              control.markAsUntouched();
              control.setErrors(null);
            }
        });
        this.mostrarCantidadOtro = false;
    }

    eliminar(index: number){
        this.solicitudesAbjuntas.splice(index, 1);
        this.solicitudesLegibles.splice(index, 1);
    }

    crearNuevoAnioArchivo(): void {
        this.mostrarRegistroAnioArchivo = true;
        this.formularioAnioArchivo = this.formularioRegistroAnioArchivo();
    }

}
