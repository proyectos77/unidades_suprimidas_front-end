import { ElementRef, Input, OnDestroy, OnInit, Renderer2, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { ListadoTiposOtros } from '../../../Transferencias/interfaces/listado-tipos-otros';
import { ListadoUnidadesConArchivo } from '../../../Transferencias/interfaces/listado-unidades-con-archivo';
import { SeriesSubseriesService } from '../../../../Core/services/series-subseries.service';
import { ListadoSeries } from '../../../Transferencias/interfaces/listado-series';
import { ListadoSubseries } from '../../../Transferencias/interfaces/listado-subseries';
import { GetListadoAnios } from '../../interfaces/get-listado-anios';
import { Subject, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
import { RespuestaRegistroCapetaUnidadActiva, Datum as CarpetaDatum } from '../../interfaces/respuesta-registro-capeta-unidad-activa';
import * as XLSX from 'xlsx';

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
    @ViewChild('cargaExcel') cargaExcelTab!: ElementRef;

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

    /*--*************** Variables para Excel ***************--*/
    public archivoSeleccionado: File | null = null;
    public procesandoExcel: boolean = false;
    public listadoCarpetasRegistradas: RespuestaRegistroCapetaUnidadActiva = {
        statusCode: 0,
        titulo: '',
        mensaje: '',
        icono: '',
        data: []
    };
    public cajaSeleccionadaExcel: number | null = null;
    public carpetasDeCajaExcel: CarpetaDatum[] = [];
    private idDocumentoGeneralExcelActual: number | null = null;
    public cantidadCajas: number = 4;
    public cantidadCarpetas: number = 12;




    constructor(
        private form: FormBuilder,
        private httpSeriesService: SeriesSubseriesService,
        private httpUnidades: UnidadesActivasService,
        private httpTransferencias: TransferenciasService,
        private sweet: SweetAlertService,
        private cdr: ChangeDetectorRef,
    ) { }



    private mostrarTab(tabEl: HTMLElement | undefined): void {
        if (!tabEl) {
            console.error('mostrarTab: el elemento de la pestaña no está disponible (ViewChild no resuelto).');
            return;
        }
        try {
            tabEl.classList.remove('disabled');
            const bootstrapGlobal = (window as any).bootstrap;
            if (bootstrapGlobal?.Tab) {
                bootstrapGlobal.Tab.getOrCreateInstance(tabEl).show();
            } else {
                console.warn('bootstrap.Tab no está disponible en window; se usa click() como respaldo.');
                tabEl.click();
            }
        } catch (e) {
            console.error('mostrarTab: error al intentar mostrar la pestaña', e);
        }
    }

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
                    this.listadoCarpetasParaExcel();
                }else{
                    this.mostrarBtnIformacion = true;
                    this.loading = false;
                    this.cajasTab.nativeElement.classList.add('disabled');
                    this.carpetasTab.nativeElement.classList.add('disabled');
                    this.cargaExcelTab.nativeElement.classList.add('disabled');
                }
            },
            error: (error) => {
                this.sweet.alertaGeneral('warning', 'No existe información', 'No se encontró información para la unidad activa.');
                this.formularioInfoGeneral.enable();
                this.mostrarBtnIformacion = true;
                this.loading = false;
                this.formularioInfoGeneral.reset();
                this.mostrarTab(this.informacionGeneralTab.nativeElement);
                this.cajasTab.nativeElement.classList.add('disabled');
                this.carpetasTab.nativeElement.classList.add('disabled');
                this.cargaExcelTab.nativeElement.classList.add('disabled');
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

    listadoCarpetasParaExcel(): void {
        this.httpUnidades.listadoCarpetasPorArchivoUnidadActiva(this.idArchivoUnidadActiva).subscribe({
            next: (respuesta) => {
                this.listadoCarpetasRegistradas = respuesta;
                if (this.listadoCarpetasRegistradas.data.length > 0) {
                    this.cargaExcelTab.nativeElement.classList.remove('disabled');
                } else {
                    this.cargaExcelTab.nativeElement.classList.add('disabled');
                }
            },
            error: (error) => {
                this.sweet.alertaGeneral('error', 'Error', 'Ocurrió un error al obtener el listado de carpetas registradas.');
            },
        });
    }

    enriquecerCajasConInformacionJerarquica(): void {
        // Inicializar labels con valores por defecto rápidamente
        this.listadoCajas.data.forEach(caja => {
            caja.labelJerarquico = `Caja ${caja.codigoCajaUnidadActiva}`;
        });

        // Crear un array de observables para todas las cajas.
        // Cada uno maneja su propio error para que una falla puntual no tumbe el resto del batch.
        const observables = this.listadoCajas.data.map(caja =>
            this.httpUnidades.infoCaja(this.idUnidadActiva, caja.idCajaUnidadActiva).pipe(
                catchError(() => of(null))
            )
        );

        // Ejecutar todas las llamadas en paralelo
        // Siempre manejar el caso en que no haya cajas para evitar dejar el select deshabilitado
        if (observables.length > 0) {
            this.cargandoCajas = true;
            this.formularioRegistroCarpeta.get('caja')?.disable();

            forkJoin(observables).subscribe({
                next: (resultados) => {
                    // Actualizar cada caja con la información completa
                    resultados.forEach((infoCaja, index) => {
                        if (!infoCaja) return;

                        const caja = this.listadoCajas.data[index];
                        let datos: any = infoCaja.data;

                        // Normalizar si la API devuelve un array (vacio o con 1 elemento) o un objeto
                        if (Array.isArray(datos)) {
                            datos = datos.length > 0 ? datos[0] : {};
                        }

                        // Manejar distintos formatos de nombre que puede devolver el backend según el ambiente
                        const cuerpo = datos.nombreCuerpo || datos.nombrecuerpo || datos.nombre_cuerpo || datos.cuerpo?.nombre_cuerpo || datos.cuerpo?.nombreCuerpo || '-';
                        const estante = datos.nombreEstante || datos.nombreestante || datos.nombre_estante || datos.estante?.nombre_estante || datos.estante?.nombreEstante || '-';
                        const balda = datos.nombreBalda || datos.nombrebalda || datos.nombre_balda || datos.balda?.nombre_balda || datos.balda?.nombreBalda || '-';
                        const nombreCaja = `Caja ${caja.codigoCajaUnidadActiva}`;

                        caja.nombreCuerpo = cuerpo;
                        caja.nombreEstante = estante;
                        (caja as any).nombreBalda = balda;
                        caja.labelJerarquico = `${cuerpo} / ${estante} / ${balda} / ${nombreCaja}`;
                    });
                    // Habilitar el select cuando la carga se complete
                    this.cargandoCajas = false;
                    this.formularioRegistroCarpeta.get('caja')?.enable();
                    this.cdr.detectChanges();
                },
                error: () => {
                    // Si hay error, deshabilita el estado de carga
                    this.cargandoCajas = false;
                    this.formularioRegistroCarpeta.get('caja')?.enable();
                    this.cdr.detectChanges();
                }
            });
        } else {
            // No hay cajas: asegurarse de que el control esté habilitado para mostrar al menos los valores por defecto
            this.formularioRegistroCarpeta.get('caja')?.enable();
            this.cargandoCajas = false;
            this.cdr.detectChanges();
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
                this.mostrarTab(this.cajasTab.nativeElement);
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
                this.mostrarTab(this.carpetasTab.nativeElement);
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
                this.mostrarTab(this.cargaExcelTab.nativeElement);
                this.listadoCarpetasParaExcel();
            },
            error: (error) => {
                this.sweet.alertaGeneral('error', 'Error', 'Ocurrió un error al registrar las carpetas.');
            }
        });
    }

    /*--*************** Métodos para Excel ***************--*/
    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.archivoSeleccionado = input.files[0];
        }
    }

    procesarArchivoExcel(): void {
        if (!this.cajaSeleccionadaExcel) {
            this.sweet.alertaGeneral('warning', 'Sin caja', 'Debe seleccionar la caja a la que pertenecen los documentos del Excel.');
            return;
        }

        if (!this.archivoSeleccionado) {
            this.sweet.alertaGeneral('warning', 'Sin archivo', 'Por favor seleccione un archivo Excel.');
            return;
        }

        this.carpetasDeCajaExcel = this.listadoCarpetasRegistradas.data
            .filter(carpeta => carpeta.idCajaUnidadActiva === this.cajaSeleccionadaExcel)
            .sort((a, b) => Number(a.numeroCarpetaUnidadActiva) - Number(b.numeroCarpetaUnidadActiva));

        if (this.carpetasDeCajaExcel.length === 0) {
            this.sweet.alertaGeneral('warning', 'Sin carpetas', 'La caja seleccionada no tiene carpetas registradas.');
            return;
        }

        this.procesandoExcel = true;

        this.httpUnidades.subirArchivoExcelFuid(this.archivoSeleccionado, this.cajaSeleccionadaExcel).subscribe({
            next: (respuesta) => {
                this.idDocumentoGeneralExcelActual = respuesta.data.id_documento_general;
                this.leerYProcesarExcel();
            },
            error: (error) => {
                this.sweet.alertaGeneral('error', 'Error', 'No se pudo almacenar el archivo Excel en el servidor.');
                this.procesandoExcel = false;
            }
        });
    }

    private leerYProcesarExcel(): void {
        const reader = new FileReader();

        reader.onload = (e: any) => {
            try {
                const datos = new Uint8Array(e.target.result);
                const workbook = XLSX.read(datos, { type: 'array' });

                console.log('=== INFORMACIÓN DEL ARCHIVO EXCEL ===');
                console.log('Número de hojas encontradas:', workbook.SheetNames.length);
                console.log('Nombres de hojas:', workbook.SheetNames);

                // Cada hoja del Excel representa una "página" que se asociará a una carpeta de la caja
                const filasPorHoja: any[][] = [];

                // Procesar todas las hojas del workbook
                workbook.SheetNames.forEach((sheetName, index) => {
                    console.log(`\n--- Procesando hoja ${index + 1}: ${sheetName} ---`);
                    const worksheet = workbook.Sheets[sheetName];

                    // Obtener la hoja como matriz para ver toda la estructura
                    const sheetAsMatrix: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    console.log(`Total filas en matriz: ${sheetAsMatrix.length}`);
                    console.log('Primeras 5 filas de la matriz:');
                    sheetAsMatrix.slice(0, 5).forEach((row, idx) => {
                        console.log(`Fila ${idx}:`, row);
                    });

                    // Buscar la fila de encabezado
                    const headerRowIndex = this.detectarIndiceEncabezado(sheetAsMatrix);
                    console.log('Índice de encabezado detectado:', headerRowIndex);

                    if (headerRowIndex === -1) {
                        console.warn(`No se encontró encabezado, intentando fallback...`);
                        const filasRaw = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
                        console.log('Filas obtenidas del fallback:', filasRaw.length);
                        if (filasRaw.length > 0) {
                            console.log('Primera fila del fallback:', filasRaw[0]);
                        }
                        filasPorHoja.push(filasRaw);
                        return;
                    }

                    // Construir encabezado desde la fila detectada y posiblemente las filas anteriores
                    const header = this.construirEncabezadoMultilinea(sheetAsMatrix, headerRowIndex);
                    console.log('Encabezado construido:', header);

                    // Filas de datos después del encabezado
                    const dataRows = sheetAsMatrix.slice(headerRowIndex + 1);
                    console.log(`Filas de datos encontradas: ${dataRows.length}`);

                    // Mapear filas a objetos
                    const mapped = dataRows
                        .filter((row: any[]) => row.some(cell => cell !== null && cell !== undefined && cell !== ''))
                        .map((row: any[]) => {
                            const obj: any = {};
                            header.forEach((colName: string, idx: number) => {
                                obj[colName] = row[idx] || '';
                            });
                            return obj;
                        });

                    console.log(`Filas válidas mapeadas: ${mapped.length}`);
                    filasPorHoja.push(mapped);
                });

                console.log('Total hojas (páginas) procesadas:', filasPorHoja.length);

                if (filasPorHoja.length === 0 || filasPorHoja.every(filas => filas.length === 0)) {
                    this.sweet.alertaGeneral('warning', 'Archivo vacío', 'No se encontraron datos válidos en el Excel.');
                    this.procesandoExcel = false;
                    return;
                }

                this.registrarDocumentosFuid(filasPorHoja);
            } catch (error) {
                console.error('Error procesando Excel:', error);
                this.sweet.alertaGeneral('error', 'Error', 'Error al procesar el archivo Excel.');
                this.procesandoExcel = false;
            }
        };

        reader.readAsArrayBuffer(this.archivoSeleccionado as File);
    }

    private construirEncabezadoMultilinea(matrix: any[][], headerRowIndex: number): string[] {
        const header: string[] = [];
        const headerRow = matrix[headerRowIndex];
        let ultimoNoVacio = '';
        const contadorPorNombre: Record<string, number> = {};

        // Procesar la fila de encabezado
        for (let i = 0; i < headerRow.length; i++) {
            let colName = String(headerRow[i] || '').trim();

            // Si la columna está vacía, buscar en la fila anterior (para encabezados multilinea)
            if (!colName && headerRowIndex > 0) {
                const prevRow = matrix[headerRowIndex - 1];
                if (prevRow && prevRow[i]) {
                    colName = String(prevRow[i]).trim();
                }
            }

            // Si sigue vacía, heredar el último encabezado no vacío de esta misma fila
            // (celdas combinadas horizontalmente, ej. "Fechas Extremas" abarcando Inicio/Fin)
            if (!colName && ultimoNoVacio) {
                colName = ultimoNoVacio;
            }

            // Si aún está vacía, usar un nombre genérico
            if (!colName) {
                colName = `Columna_${i}`;
            } else {
                ultimoNoVacio = colName;
            }

            // Evitar colisión de claves cuando un mismo nombre se repite (encabezado heredado)
            contadorPorNombre[colName] = (contadorPorNombre[colName] || 0) + 1;
            if (contadorPorNombre[colName] > 1) {
                colName = `${colName} (${contadorPorNombre[colName]})`;
            }

            header.push(colName);
        }

        return header;
    }

    registrarDocumentosFuid(filasPorHoja: any[][]): void {
        let registrosExitosos = 0;
        let registrosFallidos = 0;
        let registrosSaltados = 0;
        let registrosPendientes = 0;
        const datosValidos: any[] = [];

        console.log('=== INFORMACIÓN DE HOJAS (PÁGINAS) A PROCESAR ===');
        console.log('Total hojas recibidas:', filasPorHoja.length);
        console.log('Total carpetas de la caja seleccionada:', this.carpetasDeCajaExcel.length);

        // Cada hoja del Excel es una "página" que se asocia, en orden, a una carpeta de la caja
        if (filasPorHoja.length !== this.carpetasDeCajaExcel.length) {
            this.sweet.alertaGeneral(
                'error',
                'Páginas y carpetas no coinciden',
                `El Excel tiene ${filasPorHoja.length} hoja(s)/página(s) pero la caja seleccionada tiene ${this.carpetasDeCajaExcel.length} carpeta(s). Deben coincidir en cantidad para asociar cada página a su carpeta correspondiente.`
            );
            this.procesandoExcel = false;
            return;
        }

        filasPorHoja.forEach((filas, hojaIndex) => {
            const idCarpetaDeLaHoja = this.carpetasDeCajaExcel[hojaIndex].idCarpetaUnidadActiva;

            // Detectar el tipo de estructura del archivo
            const esFormatoFUID = this.detectarFormatoFUID(filas);
            console.log(`Hoja ${hojaIndex + 1} - Es formato FUID complejo:`, esFormatoFUID);

            // Si es formato FUID complejo, filtrar solo las filas con datos reales
            let filasAProcesar = filas;
            if (esFormatoFUID) {
                filasAProcesar = this.filtrarFilasConDatosReales(filas);
                console.log(`Hoja ${hojaIndex + 1} - Filas con datos reales encontradas:`, filasAProcesar.length);
            }

            filasAProcesar.forEach((fila, index) => {
                console.log(`\n--- Procesando fila de datos ${index + 1} de la hoja ${hojaIndex + 1} ---`);
                const datosFormateados = this.mapearFilaExcelAFuid(fila, esFormatoFUID);
                if (datosFormateados) {
                    datosFormateados.id_documento_general = this.idDocumentoGeneralExcelActual;
                    datosFormateados.id_carpeta_unidad_activa = idCarpetaDeLaHoja;
                    datosFormateados.numero_pagina = Number(datosFormateados.numero_orden) || (index + 1);
                    delete datosFormateados.url_documento;
                    datosValidos.push(datosFormateados);
                } else {
                    registrosSaltados++;
                }
            });
        });

        registrosPendientes = datosValidos.length;

        if (datosValidos.length === 0) {
            this.sweet.alertaGeneral('warning', 'Sin datos válidos', 'No se encontraron filas con los campos requeridos (nombre de serie/subserie y fechas). Revise la estructura del Excel.');
            this.procesandoExcel = false;
            return;
        }

        // Registrar solo los datos válidos
        datosValidos.forEach((datos) => {
            console.log('Enviando payload detalle documento FUID:', datos);
            this.httpUnidades.storeRegistroDetalleDocumentoGeneralFuid(datos).subscribe({
                next: (response) => {
                    registrosExitosos++;
                    registrosPendientes--;
                    if (registrosPendientes === 0) {
                        this.finalizarProcesamiento(registrosExitosos, registrosFallidos, registrosSaltados);
                    }
                },
                error: (error) => {
                    registrosFallidos++;
                    registrosPendientes--;
                    if (registrosPendientes === 0) {
                        this.finalizarProcesamiento(registrosExitosos, registrosFallidos, registrosSaltados);
                    }
                }
            });
        });
    }

    mapearFilaExcelAFuid(fila: any, esFormatoFUID: boolean = false): any {
        try {
            console.log('=== Procesando fila ===');
            console.log('Claves disponibles:', Object.keys(fila));
            console.log('Contenido completo:', fila);

            // Si el encabezado real de columnas fue detectado (títulos con texto reconocible),
            // se busca cada campo por el NOMBRE de columna (robusto ante columnas extra/reordenadas).
            // Si el encabezado sigue siendo genérico ("Columna_N"), se recurre a la posición fija
            // como respaldo, tal como venía funcionando para archivos sin encabezados reales.
            const valores = Object.values(fila);
            const claves = Object.keys(fila);
            const hayEncabezadoReal = claves.some(c => !/^Columna_\d+$/.test(c));

            // Resuelve un campo por nombre de columna cuando hay encabezado real; si no se
            // encuentra (o no hay encabezado real), recurre a la posición fija como respaldo.
            const porNombreOPosicion = (palabrasClave: string[], indicePosicional: number): any => {
                if (hayEncabezadoReal) {
                    const valor = this.buscarValorPorClave(fila, palabrasClave);
                    if (valor !== null) return valor;
                }
                return valores[indicePosicional];
            };

            const fechasEncontradas = hayEncabezadoReal ? this.buscarValoresPorClave(fila, ['fecha']) : [];

            const numeroOrden = Number(porNombreOPosicion(['orden'], 0)) || 0;
            // "codigo" se maneja como texto (no numérico) porque los radicados reales pueden
            // tener 13-16 dígitos, superando el rango de un entero y perdiendo precisión.
            const codigo = this.normalizarTexto(porNombreOPosicion(['código', 'codigo'], 1), '0');
            const nombreSerie = this.valorComoTexto(
                porNombreOPosicion(['nombre de las series', 'series, subseries', 'asuntos'], 2)
            );
            const fechaInicio = this.valorComoTexto(
                hayEncabezadoReal && fechasEncontradas.length > 0 ? fechasEncontradas[0] : valores[3]
            );
            const fechaFin = this.valorComoTexto(
                hayEncabezadoReal && fechasEncontradas.length > 1 ? fechasEncontradas[1] : valores[4]
            );

            // Las columnas de "Unidad de Conservación" (Caja/Carpeta/Tomo/Otro) y las siguientes
            // (Folios/Soporte/Frecuencia/Notas) suelen compartir un encabezado genérico agrupado
            // (ej. "UNIDAD DE CONSERVACIÓN", repetido con sufijos), sin palabras clave propias.
            // En vez de usar posiciones fijas (frágil ante columnas extra antes de este punto,
            // como duplicados de "Nombre de las Series"), se anclan las posiciones de respaldo
            // relativas a la columna de fecha_fin, que sí se ubica de forma confiable por nombre.
            const idxFechaFin = hayEncabezadoReal ? this.indiceClavePorPalabra(claves, ['fecha'], 2) : -1;
            const baseIndex = idxFechaFin >= 0 ? idxFechaFin : 4;

            const numeroCaja = this.valorComoTexto(porNombreOPosicion(['número de caja', 'numero de caja'], baseIndex + 1));
            const numeroCarpeta = this.valorComoTexto(porNombreOPosicion(['número de carpeta', 'numero de carpeta'], baseIndex + 2));
            const numeroTomo = this.valorComoTexto(porNombreOPosicion(['tomo'], baseIndex + 3));
            const numeroOtro = this.valorComoTexto(porNombreOPosicion(['otro'], baseIndex + 4));
            const numeroFolios = this.valorComoTexto(porNombreOPosicion(['folios'], baseIndex + 5));
            const soporte = this.valorComoTexto(porNombreOPosicion(['soporte'], baseIndex + 6));
            const frecuenciaConsulta = this.valorComoTexto(porNombreOPosicion(['frecuencia'], baseIndex + 7));
            const notas = this.valorComoTexto(porNombreOPosicion(['notas', 'observaciones'], baseIndex + 8));

            console.log('Campos extraídos:', {numeroOrden, codigo, nombreSerie, fechaInicio, fechaFin, numeroCaja, numeroCarpeta, soporte});

            // Validación
            if (!nombreSerie) {
                console.warn('❌ Fila sin nombre de serie/subserie, descartando');
                return null;
            }

            if (!fechaInicio || !fechaFin) {
                console.warn('❌ Fila sin fechas válidas:', {fechaInicio, fechaFin});
                return null;
            }

            const dateInicio = this.parsearFecha(fechaInicio);
            const dateFin = this.parsearFecha(fechaFin);

            if (!dateInicio || !dateFin) {
                console.warn('❌ No se pudieron parsear las fechas:', {fechaInicio, fechaFin});
                return null;
            }

            console.log('✅ Fila válida procesada correctamente');

            return {
                // id_carpeta_unidad_activa y numero_pagina se asignan luego, según el orden de las carpetas de la caja
                numero_orden: numeroOrden,
                codigo: codigo,
                nombre_serie_subserie_asunto: this.normalizarTexto(nombreSerie),
                fecha_extrema_inicio: this.formatearFecha(dateInicio),
                fecha_extrema_fin: this.formatearFecha(dateFin),
                numero_caja: this.normalizarTexto(numeroCaja, '0'),
                numero_carpeta: this.normalizarTexto(numeroCarpeta, '0'),
                numero_tomo: this.normalizarTexto(numeroTomo, '0'),
                numero_folios: this.normalizarTexto(numeroFolios, '0'),
                numero_otro: this.normalizarTexto(numeroOtro, '0'),
                numero_soporte: this.normalizarTexto(soporte, '0'),
                numero_frecuencia_consulta: this.normalizarTexto(frecuenciaConsulta, '0'),
                notas: this.normalizarTexto(notas, 'Sin notas'),
                id_estado: 1
            };
        } catch (error) {
            console.error('Error al mapear fila:', fila, error);
            return null;
        }
    }

    private valorComoTexto(valor: any): string | null {
        if (valor === null || valor === undefined || valor === '') {
            return null;
        }
        return String(valor).trim();
    }

    /** Busca el valor de la primera columna cuyo nombre de encabezado contenga alguna de las palabras clave. */
    private buscarValorPorClave(fila: any, palabrasClave: string[]): any {
        for (const clave of Object.keys(fila)) {
            const claveNormalizada = clave.toLowerCase();
            if (palabrasClave.some(p => claveNormalizada.includes(p))) {
                const valor = fila[clave];
                if (valor !== null && valor !== undefined && valor !== '') {
                    return valor;
                }
            }
        }
        return null;
    }

    /** Retorna el índice (posición) de la N-ésima clave cuyo nombre contenga alguna de las palabras clave. */
    private indiceClavePorPalabra(claves: string[], palabrasClave: string[], ocurrencia: number = 1): number {
        let contador = 0;
        for (let i = 0; i < claves.length; i++) {
            const claveNormalizada = claves[i].toLowerCase();
            if (palabrasClave.some(p => claveNormalizada.includes(p))) {
                contador++;
                if (contador === ocurrencia) return i;
            }
        }
        return -1;
    }

    /** Igual que buscarValorPorClave pero retorna TODOS los valores encontrados, en orden de columna. */
    private buscarValoresPorClave(fila: any, palabrasClave: string[]): any[] {
        const encontrados: any[] = [];
        for (const clave of Object.keys(fila)) {
            const claveNormalizada = clave.toLowerCase();
            if (palabrasClave.some(p => claveNormalizada.includes(p))) {
                const valor = fila[clave];
                if (valor !== null && valor !== undefined && valor !== '') {
                    encontrados.push(valor);
                }
            }
        }
        return encontrados;
    }

    private obtenerValorFlexible(fila: any, posiblesNombres: string[]): any {
        for (const nombre of posiblesNombres) {
            const valor = fila[nombre];
            if (valor !== null && valor !== undefined && valor !== '') {
                return String(valor).trim();
            }
        }
        return null;
    }

    private normalizarTexto(valor: any, valorPorDefecto: string = ''): string {
        if (valor === null || valor === undefined) {
            return valorPorDefecto;
        }

        const texto = String(valor).trim();
        return texto === '' ? valorPorDefecto : texto;
    }

    private parsearFecha(fechaStr: any): Date | null {
        if (!fechaStr) return null;

        // Si ya es un objeto Date válido
        if (fechaStr instanceof Date && !isNaN(fechaStr.getTime())) {
            return fechaStr;
        }

        // Convertir a string si no lo es
        const str = String(fechaStr).trim();

        console.log(`Intentando parsear fecha: "${str}"`);

        // Si es puramente numérico, es un serial date de Excel (días desde 1899-12-30).
        // Debe evaluarse ANTES que "new Date(str)": JS interpreta un string numérico
        // como "44210" como el AÑO 44210 (no da NaN), produciendo fechas inválidas.
        if (/^\d+$/.test(str)) {
            const num = Number(str);
            const excelDate = new Date((num - 25569) * 86400 * 1000);
            if (!isNaN(excelDate.getTime())) {
                console.log(`✅ Fecha parseada serial Excel: ${excelDate}`);
                return excelDate;
            }
        }

        // Intentar parsear en diferentes formatos
        // Formato: YYYY-MM-DD
        let date = new Date(str);
        if (!isNaN(date.getTime())) {
            console.log(`✅ Fecha parseada formato ISO: ${date}`);
            return date;
        }

        // Formato: DD/MM/YYYY o DD-MM-YYYY
        const regexDDMMYYYY = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/;
        const matchDDMMYYYY = str.match(regexDDMMYYYY);
        if (matchDDMMYYYY) {
            const day = parseInt(matchDDMMYYYY[1], 10);
            const month = parseInt(matchDDMMYYYY[2], 10);
            const year = parseInt(matchDDMMYYYY[3], 10);
            date = new Date(year, month - 1, day);
            if (!isNaN(date.getTime())) {
                console.log(`✅ Fecha parseada formato DD/MM/YYYY: ${date}`);
                return date;
            }
        }

        // Formato: YYYY/MM/DD
        const regexYYYYMMDD = /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/;
        const matchYYYYMMDD = str.match(regexYYYYMMDD);
        if (matchYYYYMMDD) {
            const year = parseInt(matchYYYYMMDD[1], 10);
            const month = parseInt(matchYYYYMMDD[2], 10);
            const day = parseInt(matchYYYYMMDD[3], 10);
            date = new Date(year, month - 1, day);
            if (!isNaN(date.getTime())) {
                console.log(`✅ Fecha parseada formato YYYY/MM/DD: ${date}`);
                return date;
            }
        }

        console.warn(`❌ No se pudo parsear la fecha: "${str}"`);
        return null;
    }

    private formatearFecha(fecha: Date | null): string | null {
        if (!fecha) return null;

        // Usar UTC para evitar problemas de timezone
        const year = fecha.getUTCFullYear();
        const month = String(fecha.getUTCMonth() + 1).padStart(2, '0');
        const day = String(fecha.getUTCDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    private detectarFormatoFUID(filas: any[]): boolean {
        // Si hay menos de 10 filas, probablemente no es FUID
        if (filas.length < 10) return false;

        // Buscar indicadores de formato FUID
        // Normalmente tiene encabezados complejos multilinea con "MINISTERIO DE DEFENSA"
        const primerasFilas = filas.slice(0, 10);
        let tieneIndicadorFUID = false;

        primerasFilas.forEach((fila) => {
            const keys = Object.keys(fila);
            keys.forEach((key) => {
                if (key.includes('MINISTERIO') || key.includes('DEFENSA')) {
                    tieneIndicadorFUID = true;
                }
            });
        });

        return tieneIndicadorFUID;
    }

    /**
     * Buscar la fila de encabezado real (con los títulos de columna) en una matriz de hoja (header:1).
     * Se exige que coincidan varias palabras clave distintas en la misma fila para no confundir
     * la fila de encabezados con la fila de título/banner (que solo suele contener
     * "FORMATO ÚNICO DE INVENTARIO DOCUMENTAL" en una única celda combinada).
     */
    private detectarIndiceEncabezado(matrix: any[][]): number {
        const posiblesEncabezados = [
            'orden', 'código', 'codigo', 'nombre de las series', 'series, subseries', 'asuntos',
            'fecha', 'número de caja', 'numero de caja', 'número de carpeta', 'numero de carpeta',
            'tomo', 'otro', 'número de folios', 'numero de folios', 'soporte',
            'frecuencia de consulta', 'notas'
        ];

        let mejorFila = -1;
        let mejorCantidadMatches = 0;

        for (let i = 0; i < Math.min(matrix.length, 20); i++) {
            const row = matrix[i].map((c: any) => String(c || '').trim().toLowerCase());
            const cantidadMatches = posiblesEncabezados.filter(h => row.some(cell => cell.includes(h))).length;
            if (cantidadMatches > mejorCantidadMatches) {
                mejorCantidadMatches = cantidadMatches;
                mejorFila = i;
            }
        }

        // Se exigen al menos 4 columnas reconocidas para confiar en que es la fila de encabezados real
        // (evita que una fila de título con una sola coincidencia, ej. "FORMATO ÚNICO...", se tome como encabezado)
        console.log(`detectarIndiceEncabezado: mejor fila = ${mejorFila}, coincidencias = ${mejorCantidadMatches}`);
        return mejorCantidadMatches >= 4 ? mejorFila : -1;
    }

    private filtrarFilasConDatosReales(filas: any[]): any[] {
        // En formato FUID, los datos reales son filas donde la primera columna es un número
        // que representa el número de orden (1, 2, 3, etc.)
        return filas.filter((fila) => {
            const firstKey = Object.keys(fila)[0];
            const primerValor = fila[firstKey];
            // Detectar si es un número (orden) o un string (encabezado)
            return typeof primerValor === 'number' && primerValor > 0;
        });
    }

    finalizarProcesamiento(exitosos: number, fallidos: number, saltados: number = 0): void {
        this.procesandoExcel = false;

        if (fallidos > 0) {
            this.sweet.alertaGeneral('warning', 'Procesamiento completado', `Se registraron ${exitosos} documentos correctamente. ${fallidos} registros fallaron en la validación del servidor.`);
        } else if (exitosos === 0) {
            this.sweet.alertaGeneral('warning', 'Procesamiento completado', 'No se registró ningún documento.');
        } else {
            this.sweet.alertaGeneral('success', 'Procesamiento completado', `Se registraron ${exitosos} documentos correctamente.`);
        }

        // Limpiar el archivo seleccionado
        this.archivoSeleccionado = null;
        const input = document.getElementById('inputExcelCarpetas') as HTMLInputElement;
        if (input) {
            input.value = '';
        }
    }

}
