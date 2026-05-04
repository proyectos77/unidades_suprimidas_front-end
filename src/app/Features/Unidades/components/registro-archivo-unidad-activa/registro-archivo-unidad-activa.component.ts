import { ElementRef, Input, OnDestroy, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { ListadoTiposOtros } from '../../../Transferencias/interfaces/listado-tipos-otros';
import { ListadoUnidadesConArchivo } from '../../../Transferencias/interfaces/listado-unidades-con-archivo';
import { SeriesSubseriesService } from '../../../../Core/services/series-subseries.service';
import { ListadoSeries } from '../../../Transferencias/interfaces/listado-series';
import { ListadoSubseries } from '../../../Transferencias/interfaces/listado-subseries';
import { GetListadoAnios } from '../../interfaces/get-listado-anios';
import { Subject, forkJoin } from 'rxjs';
import { TransferenciasService } from '../../../Transferencias/services/transferencias.service';
import { SweetAlertService } from '../../../../Core/services/sweet-alert.service';
import { SetRegistroArchivoUnidadActiva } from '../../interfaces/set-registro-archivo-unidad-activa';
import { StoreInformacionGeneralArchivoUnidadACtva } from '../../interfaces/store-informacion-general-archivo-unidad-actva';
import { UnidadesActivasService } from '../../services/unidades-activas.service';
import { ListadoCuerposUnidadesActivas } from '../../interfaces/listado-cuerpos-unidades-activas';
import { id } from '@swimlane/ngx-charts';
import { ListadoEstantesCuerpoArchivoUnidadActiva } from '../../interfaces/listado-estantes-cuerpo-archivo-unidad-activa';
import { ListadoBaldasEstantesArchivoUnidadActiva } from '../../interfaces/listado-baldas-estantes-archivo-unidad-activa';
import { StoreCajasArchivoUnidadesActivas } from '../../interfaces/store-cajas-archivo-unidades-activas';
import { log } from 'console';
import { StoreCapetaUnidadActiva } from '../../interfaces/store-capeta-unidad-activa';
import { GetInformacionGeneralArchivoUnidadActiva } from '../../interfaces/get-informacion-general-archivo-unidad-activa';
import { LoaderComponent } from '../../../../Shared/Components/loader/loader.component';
import { NavigationEnd } from '@angular/router';
import { GetListadoCajasArchivoUnidadActiva } from '../../interfaces/get-listado-cajas-archivo-unidad-activa';

@Component({
  selector: 'app-registro-archivo-unidad-activa',
  imports: [ReactiveFormsModule, FormsModule, NgIf, NgFor, LoaderComponent],
  templateUrl: './registro-archivo-unidad-activa.component.html',
  styleUrl: './registro-archivo-unidad-activa.component.css'
})
export default class RegistroArchivoUnidadActivaComponent implements OnInit, OnDestroy {

    @Input() idUnidadActiva!: number;

    /*--*************** ViewChild ***************--*/
    @ViewChild('informacionGeneral') informacionGeneralTab!: ElementRef;
    @ViewChild('cajas') cajasTab!: ElementRef;
    @ViewChild('carpetas') carpetasTab!: ElementRef;

    /*--*************** Formularios ***************--*/
    public formularioInfoGeneral!: FormGroup;
    public formularioRegistroCaja!:  FormGroup;

    public formularioRegistroCarpeta!: FormGroup;

    /*--*************** Listados e información ***************--*/
    public cuerpos: ListadoCuerposUnidadesActivas = {
        statusCode: 0,
        titulo: '',
        mensaje: '',
        icono: '',
        data: []
    };

    public estantes: ListadoEstantesCuerpoArchivoUnidadActiva = {
        statusCode: 0,
        titulo: '',
        mensaje: '',
        icono: '',
        data: []
    };

    public baldas: ListadoBaldasEstantesArchivoUnidadActiva = {
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

    /*--*************** Variables e interfaces ***************--*/
    public mostrarBtnIformacion = true;
    public loading = false;
    public idArchivoUnidadActiva: number = 0;
    public anioCaja: string = '';
    public cargandoCajas: boolean = false;

    public cajasAgrupadas: StoreCajasArchivoUnidadesActivas = {
        cajas: []
    };

    public carpetasAgrupadas: StoreCapetaUnidadActiva = {
        carpetas: []
    };

    public informacionGeneral: GetInformacionGeneralArchivoUnidadActiva = {
        statusCode: 0,
        titulo: '',
        mensaje: '',
        icono: '',
        data: {
            id_archivo_unidad_activa: 0,
            id_unidad: 0,
            ubicacion_archivo_unidad_activa: '',
            direccion_archivo_unidad_activa: '',
            edificio_archivo_unidad_activa: '',
            piso_archivo_unidad_activa: '',
            bodega_archivo_unidad_activa: '',
            fecha_creacion_archivo_unidad_activa: new Date(),
            fecha_actualizacion_archivo_unidad_activa: new Date(),
            id_estado: 0
        }
    }

    public listadoCajas: GetListadoCajasArchivoUnidadActiva = {
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

    private destroy$ = new Subject<void>();
    public mostrarCantidadOtro: boolean = false;
    public otroAgregado: boolean = false;
    public solicitudesAbjuntas: SetRegistroArchivoUnidadActiva [] = [];
    public rutaUnidad: string = '';

    public anioSeleccionado: boolean = false;
    public mostrarRegistroAnioArchivo: boolean = false;


    private cantidadOtro: number = 0;
    public solicitudesLegibles: any[] = [];


    public listadoUnidadesConArchivo: ListadoUnidadesConArchivo = {
        statusCode: 0,
        titulo: '',
        mensaje: '',
        icono: '',
        data: []
    };




    constructor(
        private form: FormBuilder,
        private httpSeriesService: SeriesSubseriesService,
        private httpUnidades: UnidadesActivasService,
        private httpTransferencias: TransferenciasService,
        private sweet: SweetAlertService,


    ) { }



    ngOnInit(): void {
        /* Inicio de formularios */
        this.formularioInfoGeneral = this.formularioInformacionGeneral();
        this.formularioRegistroCaja = this.formularioRegistroCajas();
        this.formularioRegistroCarpeta = this.formularioCarpeta();
        this.loading = false;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['idUnidadActiva'] && changes['idUnidadActiva'].currentValue) {
            /* loading */
            this.loading = true;

            /* Get Informacion */
            this.getInformacionGeneral();
            this.listadoCuerpos();

            /* Escuchar cambios */
            this.escucharCambiosCuerpo();
            this.escucharCambiosEstante();
            this.escucharCambiosBalda();
            this.escucharCambiosCaja();
            this.escucharCambiosSeries();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /*--*************** Fomularios ***************--*/
    formularioInformacionGeneral():FormGroup{
        return this.form.group({
            ubicacion: ['', Validators.required],
            direccion: ['', Validators.required],
            edificio: ['', Validators.required],
            piso: ['', Validators.required],
            bodega: ['', Validators.required],
        });
    }

    formularioRegistroCajas():FormGroup{
        return this.form.group({
            cuerpo: ['', Validators.required],
            estante: [{value: '', disabled: true}, Validators.required],
            baldas: [{value: '', disabled: true}, Validators.required],
            codigoCaja: ['', Validators.required],
            numeroConsecutivoBodega: ['', Validators.required],
            numeroCorrelativoDependencia: ['', Validators.required],
            anio: ['', Validators.required],
            libros: [''],
            carpetas: ['', Validators.required],
        });
    }

    formularioCarpeta():FormGroup{
        return this.form.group({
            caja: ['', Validators.required],
            serie: [{value: '', disabled: true}, Validators.required],
            subserie: [{value: '', disabled: true}, Validators.required],
            numeroCarpeta: ['', Validators.required],
            fechaExtremaInicio: ['', Validators.required],
            fechaExtremaFin: ['', Validators.required], // Corregido el nombre del campo
            cantidadFolios: ['', Validators.required],
        });
    }

    /*--*************** Listados e información ***************--*/
    getInformacionGeneral():void{
        this.httpUnidades.getInformacionGeneralArchivoUnidad(this.idUnidadActiva).subscribe({
            next: (respuesta) => {
                this.informacionGeneral = respuesta;
                if (this.informacionGeneral.data != null) {
                    this.formularioInfoGeneral.patchValue({
                        ubicacion: this.informacionGeneral.data.ubicacion_archivo_unidad_activa,
                        direccion: this.informacionGeneral.data.direccion_archivo_unidad_activa,
                        edificio: this.informacionGeneral.data.edificio_archivo_unidad_activa,
                        piso: this.informacionGeneral.data.piso_archivo_unidad_activa,
                        bodega: this.informacionGeneral.data.bodega_archivo_unidad_activa,
                    });

                    this.formularioInfoGeneral.disable();
                    this.idArchivoUnidadActiva = this.informacionGeneral.data.id_archivo_unidad_activa;
                    this.mostrarBtnIformacion = false;
                    this.loading = false;
                    this.cajasTab.nativeElement.classList.remove('disabled');
                    this.carpetasTab.nativeElement.classList.remove('disabled');
                    this.listadoCajasArchivoUnidadActiva();
                }else{
                    this.mostrarBtnIformacion = true;
                    this.loading = false;
                    this.cajasTab.nativeElement.classList.add('disabled');
                    this.carpetasTab.nativeElement.classList.add('disabled');
                }
            },
            error: (error) => {
                this.sweet.alertaGeneral('warning', 'No existe información', 'No se encontró información para la unidad activa.');
                this.formularioInfoGeneral.enable();
                this.mostrarBtnIformacion = true;
                this.loading = false;
                this.formularioInfoGeneral.reset();
                this.informacionGeneralTab.nativeElement.dispatchEvent(new Event('click'));
                this.cajasTab.nativeElement.classList.add('disabled');
                this.carpetasTab.nativeElement.classList.add('disabled');
            },
        });
    }

    listadoCuerpos():void {
        this.httpUnidades.listadoCuerpos().subscribe({
            next: (respuesta) => {
                this.cuerpos = respuesta;
            },
            error: (error) => {
                this.sweet.alertaGeneral('error', 'Error', 'Ocurrió un error al obtener el listado de cuerpos.');
            },
        });
    }

    escucharCambiosCuerpo(): void {
        this.formularioRegistroCaja.get('cuerpo')?.valueChanges.subscribe((idCuerpo) => {
            if (idCuerpo) {
                this.formularioRegistroCaja.get('estante')?.enable();
                this.listadoEstantes(idCuerpo);
            }
        });
    }

    listadoEstantes(idCuerpo: number):void{
        this.httpUnidades.listadoEstantes(idCuerpo).subscribe({
            next: (respuesta) => {
                this.estantes = respuesta;
            },
            error: (error) => {
                this.sweet.alertaGeneral('error', 'Error', 'Ocurrió un error al obtener el listado de estantes.');
            },
        });
    }

    escucharCambiosEstante(): void {
        this.formularioRegistroCaja.get('estante')?.valueChanges.subscribe((idEstante) => {
            if (idEstante) {
                this.formularioRegistroCaja.get('baldas')?.enable();
                this.listadoBaldas(idEstante);
            }
        });
    }

    listadoBaldas(idEstante: number):void{
        this.httpUnidades.listadoBaldas(idEstante).subscribe({
            next: (baldas) => {
                this.baldas = baldas;
            },
            error: (error) => {
                this.sweet.alertaGeneral('error', 'Error', 'Ocurrió un error al obtener el listado de baldas.');
            },
        });
    }

    escucharCambiosBalda():void{
        this.formularioRegistroCaja.get('baldas')?.valueChanges.subscribe((idBalda) => {
            if(idBalda){
                this.listadoAnios();
            }
        });
    }

    listadoAnios():void {
        this.httpUnidades.listadoAnios().subscribe({
            next: (respuesta) => {
                this.anios = respuesta;
            },
            error: (error) => {
                this.sweet.alertaGeneral('error', 'Error', 'Ocurrió un error al obtener el listado de años.');
            },
        });
    }

    listadoCajasArchivoUnidadActiva():void{
        this.httpUnidades.listadoCajas(this.idArchivoUnidadActiva).subscribe({
            next: (respuesta) => {
                this.listadoCajas = respuesta;
                // Enriquecer cada caja con información jerárquica
                this.enriquecerCajasConInformacionJerarquica();
            },
            error: (error) => {
                this.sweet.alertaGeneral('error', 'Error', 'Ocurrió un error al obtener el listado de cajas del archivo de la unidad activa.');
            },
        });
    }

    enriquecerCajasConInformacionJerarquica(): void {
        // Inicializar labels con valores por defecto rápidamente
        this.listadoCajas.data.forEach(caja => {
            caja.labelJerarquico = caja.codigoCajaUnidadActiva;
        });

        // Crear un array de observables para todas las cajas
        const observables = this.listadoCajas.data.map(caja =>
            this.httpUnidades.infoCaja(this.idArchivoUnidadActiva, caja.idCajaUnidadActiva)
        );

        // Ejecutar todas las llamadas en paralelo
        if (observables.length > 0) {
            this.cargandoCajas = true;
            this.formularioRegistroCarpeta.get('caja')?.disable();

            forkJoin(observables).subscribe({
                next: (resultados) => {
                    // Actualizar cada caja con la información completa
                    resultados.forEach((infoCaja, index) => {
                        const caja = this.listadoCajas.data[index];
                        const datos = infoCaja.data;
                        // Manejar ambos formatos (camelCase y lowercase) para compatibilidad con producción
                        const cuerpo = datos.nombrecuerpo || datos.nombreCuerpo || '-';
                        const estante = datos.nombreEstante || datos.nombreestante || '-';
                        const balda = datos.nombreBalda || datos.nombrebalda || '-';
                        const nombreCaja = caja.codigoCajaUnidadActiva;

                        caja.nombreCuerpo = cuerpo;
                        caja.nombreEstante = estante;
                        caja.nombreBaldà = balda;
                        caja.labelJerarquico = `${cuerpo} / ${estante} / ${balda} / ${nombreCaja}`;
                    });
                    // Habilitar el select cuando la carga se complete
                    this.cargandoCajas = false;
                    this.formularioRegistroCarpeta.get('caja')?.enable();
                },
                error: () => {
                    // Si hay error, deshabilita el estado de carga
                    this.cargandoCajas = false;
                    this.formularioRegistroCarpeta.get('caja')?.enable();
                }
            });
        }
    }

    escucharCambiosCaja():void{
        this.formularioRegistroCarpeta.get('caja')?.valueChanges.subscribe((idCaja) => {
            if(idCaja){
                this.listadoCajas.data.forEach(caja => {
                    if(caja.idCajaUnidadActiva === Number(idCaja)){
                        this.anioCaja = caja.anioCajaUnidadActiva;
                        this.formularioRegistroCarpeta.get('serie')?.enable();
                        this.listadoSeries(this.anioCaja);
                        return;
                    }
                });
            }
        });
    }

    listadoSeries(anio:string):void{
        this.httpSeriesService.getListadoSeries(anio).subscribe({
            next: (respuesta) => {
                this.series = respuesta;
            },
            error: (error) => {
                this.sweet.alertaGeneral('error', 'Error', 'Ocurrió un error al obtener el listado de series.');
            },

        });
    }

    escucharCambiosSeries():void{
        this.formularioRegistroCarpeta.get('serie')?.valueChanges.subscribe((idSerie) => {
            if(idSerie){
                this.listadoSubseries(idSerie);
            }
        });
    }

    listadoSubseries(idSerie:number):void{
        this.httpSeriesService.getListadoSubseries(idSerie).subscribe({
            next: (respuesta) => {
                this.subseries = respuesta;
                const subserieControl = this.formularioRegistroCarpeta.get('subserie');
                if (this.subseries.data.length === 0) {
                    subserieControl?.reset('');
                    subserieControl?.disable();
                    // Quitar validador requerido si no hay subseries
                    subserieControl?.clearValidators();
                    subserieControl?.updateValueAndValidity();
                } else {
                    subserieControl?.enable();
                    // Agregar validador requerido si hay subseries
                    subserieControl?.setValidators([Validators.required]);
                    subserieControl?.updateValueAndValidity();
                }
            },
            error: (error) => {
                this.sweet.alertaGeneral('error', 'Error', 'Ocurrió un error al obtener el listado de subseries.');
            },
        });
    }

    /*--*************** Registros y valdiaciones ***************--*/
    validarFormInformacionGeneral():void{
        if (this.formularioInfoGeneral.invalid) {
            this.formularioInfoGeneral.markAllAsTouched();
            this.sweet.alertaCamposInvalidosFormularios();
            return
        }

        let dataForm = this.createDataInformacionGeneral();
        this.registroInformacionGeneral(dataForm);
    }

    createDataInformacionGeneral():StoreInformacionGeneralArchivoUnidadACtva{
        return {
            ...this.formularioInfoGeneral.value,
            id_unidad: this.idUnidadActiva
        }
    }

    registroInformacionGeneral(dataForm: StoreInformacionGeneralArchivoUnidadACtva):void{
        this.httpUnidades.storeRegistroArchivoInformacionGeneral(dataForm).subscribe({
            next: (dataGeneral) =>{
                this.idArchivoUnidadActiva = dataGeneral.data.id_archivo_unidad_activa;
                this.sweet.alertaGeneral(dataGeneral.icono, dataGeneral.titulo, dataGeneral.mensaje);
                this.cajasTab.nativeElement.classList.remove('disabled');
                this.carpetasTab.nativeElement.classList.remove('disabled');
                this.cajasTab.nativeElement.dispatchEvent(new Event('click'));
            },

            error: (error) =>{
                this.sweet.alertaGeneral(error.icono, error.titulo, error.mensaje);
            }
        })
    }

    eliminar(index: number){
        this.solicitudesAbjuntas.splice(index, 1);
        this.solicitudesLegibles.splice(index, 1);
    }

    agregarCajaAgrupada(): void {
        if (this.formularioRegistroCaja.invalid) {
            this.formularioRegistroCaja.markAllAsTouched();
            this.sweet.alertaCamposInvalidosFormularios();
            return;
        }
        if (this.cajasAgrupadas.cajas.length >= 4) {
            this.sweet.alertaGeneral('warning', 'Máximo alcanzado', 'Solo puede agrupar hasta 4 cajas.');
            return;
        }
        const caja = {
            baldas: Number(this.formularioRegistroCaja.value.baldas),
            archivoUnidadActiva: Number(this.idArchivoUnidadActiva),
            codigoCaja: this.formularioRegistroCaja.value.codigoCaja,
            numeroConsecutivoBodega: this.formularioRegistroCaja.value.numeroConsecutivoBodega,
            numeroCorrelativoDependencia: this.formularioRegistroCaja.value.numeroCorrelativoDependencia,
            anio: this.formularioRegistroCaja.value.anio,
            libros: this.formularioRegistroCaja.value.libros,
            carpetas: this.formularioRegistroCaja.value.carpetas
        };
        this.cajasAgrupadas.cajas.push(caja);
        this.formularioRegistroCaja.reset();
        this.formularioRegistroCaja.patchValue({
            cuerpo: '',
            estante: '',
            baldas: '',});
        this.formularioRegistroCaja.get('estante')?.disable();
        this.formularioRegistroCaja.get('baldas')?.disable();
    }

    eliminarCajaAgrupada(index: number): void {
        this.cajasAgrupadas.cajas.splice(index, 1);
    }

    registrarCajasAgrupadas(): void {
        if (this.cajasAgrupadas.cajas.length === 0) {
            this.sweet.alertaGeneral('warning', 'No hay cajas', 'Debe agregar al menos una caja antes de registrar.');
            return;
        }
        this.httpUnidades.sotoreRegistroCajasArchivoUnidadActiva(this.cajasAgrupadas).subscribe({
            next: (response) => {
                this.sweet.alertaGeneral('success', 'Registro exitoso', 'Las cajas han sido registradas correctamente.');
                this.cajasAgrupadas.cajas = [];
                this.carpetasTab.nativeElement.dispatchEvent(new Event('click'));
                this.listadoCajasArchivoUnidadActiva();
            },
            error: (error) => {
                this.sweet.alertaGeneral('error', 'Error', 'Ocurrió un error al registrar las cajas.');
            }
        });
    }

    agregarCarpetaAgrupada(): void {
        if (this.formularioRegistroCarpeta.invalid) {
            this.formularioRegistroCarpeta.markAllAsTouched();
            this.sweet.alertaCamposInvalidosFormularios();
            return;
        }
        // Se agrega la carpeta al arreglo
        const idCaja = this.formularioRegistroCarpeta.value.caja;
        const cajaSeleccionada = this.listadoCajas.data.find(caja => caja.idCajaUnidadActiva === Number(idCaja));
        const nombreCaja = cajaSeleccionada ? cajaSeleccionada.codigoCajaUnidadActiva : '';

        const carpeta = {
            cajaUnidadActiva: idCaja,
            nombreCaja: nombreCaja,
            serie: this.formularioRegistroCarpeta.value.serie,
            subserie: this.formularioRegistroCarpeta.value.subserie,
            numeroCarpeta: this.formularioRegistroCarpeta.value.numeroCarpeta.toString(),
            fechaExtremaInicio: this.formularioRegistroCarpeta.value.fechaExtremaInicio,
            fechaExtremaFin: this.formularioRegistroCarpeta.value.fechaExtremaFin,
            cantidadFolios: this.formularioRegistroCarpeta.value.cantidadFolios.toString()
        };

        this.carpetasAgrupadas.carpetas.push(carpeta);
        this.formularioRegistroCarpeta.reset();
        this.formularioRegistroCarpeta.patchValue({
            caja: '',
            serie: '',
            subserie: '',});
        this.formularioRegistroCarpeta.get('serie')?.disable();
        this.formularioRegistroCarpeta.get('subserie')?.disable();
    }

    eliminarCarpetaAgrupada(index: number): void {
        this.carpetasAgrupadas.carpetas.splice(index, 1);
    }

    registrarCarpetasAgrupadas(): void {
        if (this.carpetasAgrupadas.carpetas.length === 0) {
            this.sweet.alertaGeneral('warning', 'No hay carpetas', 'Debe agregar al menos una carpeta antes de registrar.');
            return;
        }

        // Aquí deberías llamar al servicio correspondiente para registrar las carpetas agrupadas
        this.httpUnidades.storeRegistroCarpetasArchivoUnidadActiva(this.carpetasAgrupadas).subscribe({
            next: (response) => {
                this.sweet.alertaGeneral('success', 'Registro exitoso', 'Las carpetas han sido registradas correctamente.');
                this.carpetasAgrupadas = { carpetas: [] };
            },
            error: (error) => {
                this.sweet.alertaGeneral('error', 'Error', 'Ocurrió un error al registrar las carpetas.');
            }
        });
    }

}
