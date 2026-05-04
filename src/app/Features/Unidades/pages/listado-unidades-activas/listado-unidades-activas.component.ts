import { Component, OnInit, viewChild, ElementRef, OnChanges, ChangeDetectorRef } from '@angular/core';
import { UnidadesService } from '../../services/unidades.service';
import { GetAllListadoUnidadesActivas } from '../../interfaces/get-all-listado-unidades-activas';
import { FormsModule, NgForm } from '@angular/forms';
import { Modal } from 'bootstrap';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ModalEditarUnidadComponent } from '../../components/modal-editar-unidad/modal-editar-unidad.component';
import { RouterLink, RouterModule } from '@angular/router';
import { DatumUnidad } from '../../interfaces/get-all-unidades';
import { SweetAlertService } from '../../../../Core/services/sweet-alert.service';
import { LoginService } from '../../../../Auth/services/login.service';
import { BuscadorListadoUnidadesActivasPipe } from '../../../../Shared/Pipes/buscador-listado-unidades-activas.pipe';

import { ArchivoUnidadActivaComponent } from '../../components/archivo-unidad-activa/archivo-unidad-activa.component';
import { FolderNiveles } from '../../interfaces/FolderNiveles';
import RegistroArchivoUnidadActivaComponent from '../../components/registro-archivo-unidad-activa/registro-archivo-unidad-activa.component';
import { log } from 'node:console';
import { UnidadesActivasService } from '../../services/unidades-activas.service';
import { GetResumenAlmacenamiento } from '../../interfaces/get-resumen-almacenamiento';

declare var bootstrap: any;
declare var bootstrapArchivo: any;

@Component({
  selector: 'app-listado-unidades-activas',
  imports: [RouterModule, RouterLink, NgFor, NgIf, NgClass, ModalEditarUnidadComponent, BuscadorListadoUnidadesActivasPipe, FormsModule, RegistroArchivoUnidadActivaComponent, ArchivoUnidadActivaComponent],
  templateUrl: './listado-unidades-activas.component.html',
  styleUrl: './listado-unidades-activas.component.css'
})
 export default class ListadoUnidadesActivasComponent implements OnInit {

  public mostrarDesglose: boolean = false;
  public resumenAlmacenamiento: GetResumenAlmacenamiento | null = null;
  public unidadDesglose: number = 0;
  public archivoNoRegistrado: boolean = false;
  folders: FolderNiveles[] = [];

  // Callbacks para lazy-loading
  public onLoadEstantesCallback = (folder: FolderNiveles, idUnidad: number) => this.cargarEstantes(folder, idUnidad);
  public onLoadBaldasCallback = (folder: FolderNiveles, idUnidad: number) => this.cargarBaldas(folder, idUnidad);
  public onLoadCajasCallback = (folder: FolderNiveles, idUnidad: number) => this.cargarCajas(folder, idUnidad);
  public onLoadCarpetasCallback = (folder: FolderNiveles, idUnidad: number) => this.cargarCarpetas(folder, idUnidad);


    public bootstrapModal: any;
    public bootstrapModalRegistroArchivo: any;
    public pagina:number = 1;
    public totalRegistros:number = 0;
    public registrosPorPagina:number = 0;
    public totalPaginas:number = 0;
    public unidad!: DatumUnidad;
    public unidadArchivo!: number;
    private padre: number = 0;
    public listaUnidades: GetAllListadoUnidadesActivas = {
        'statusCode': 0,
        'titulo': '',
        'icono': '',
        'mensaje': '',
        'data': [],
        'infoPagination': {
            'pagina': 0,
            'totalPaginas': 0,
            'totalRegistro': 0,
            'totalRegistrosPorPagina': 0
        }
    };

    public filterPost: string = '';
    public rolUser: number = 0;
    private dependencia: number = 0;

    public padresUnidad: Array<{ opciones: any[]; seleccion: any }> = [];
    public observacion: string = '';

    private modalInstance: Modal | null = null;
    private modalActualizar = viewChild<ElementRef>('buscarObservacion');

    public idDetalle: number | null = null;

    cargaModalRegistroArchivo: boolean = false;

    constructor(private httpUnidades: UnidadesService, private sweet: SweetAlertService, private httpLogin: LoginService, private httpUnidadesActivas: UnidadesActivasService, private cdr: ChangeDetectorRef) {
        const sesion = this.httpLogin.datosSesion();
        this.rolUser = sesion.idTipoUsuario;
        this.dependencia = sesion.idDependencia;
    }

   ngOnInit(): void {
        this.getLListadoUnidadesActivas();
        this.listadoDependenciasPadre();
   }

   getLListadoUnidadesActivas(pagina: number = 1):void{
        this.httpUnidades.listadoUnidadesActivas(pagina, this.filterPost, this.padre).subscribe( (unidades) => {

            if (unidades.statusCode == 200 && unidades.data.length == 0) {
                this.mostrarDesglose = true; // 🔥 activar vista nueva
            } else {
                this.mostrarDesglose = false; // 🔥 mostrar tabla normal
            }
            this.listaUnidades = unidades;
            this.pagina = unidades.infoPagination.pagina;
        });
   }

   cambiarPagina(pagina: number):void{
        if (pagina >= 1 && pagina <= this.listaUnidades.infoPagination.totalPaginas) {
            this.getLListadoUnidadesActivas(pagina);
        }
    }

    editarEstado(estadoACtual: number, idUnidad: number):void{
      let estado = (estadoACtual === 1) ? 2 : 1;
      this.httpUnidades.updateEstadoUnidad(estado, idUnidad).subscribe(updateEstado =>{
          this.sweet.alertaGeneral(updateEstado.icono, updateEstado.titulo, updateEstado.mensaje);
          this.getLListadoUnidadesActivas(1);
      });
  }

   limpiarFiltros(): void {
        this.filterPost = '';
        this.padre = 0;
        this.listadoDependenciasPadre();
        this.getLListadoUnidadesActivas();

    }

    abrirModalBuscarObservacion():void {
        this.observacion = '';
        const modal = this.modalActualizar();
        if (modal) {
            this.modalInstance = new Modal(modal.nativeElement);
            this.modalInstance.show();
        }

    }

    filtroTexto(filtro: string): void {
        this.filterPost = filtro;
        this.pagina = 0;
        this.getLListadoUnidadesActivas();
    }

    abrirModal(unidad: DatumUnidad):void{
        const modal = document.getElementById('modalEditarUnidades');
        this.bootstrapModal = new bootstrap.Modal(modal);
        this.unidad = unidad;
        this.bootstrapModal.show();
    }

    abrirModalRegistroArchivo(idUnidad: number | null):void{
        const modalArchivo = document.getElementById('modalRegistroArchivoUnidadActiva');
        this.bootstrapModalRegistroArchivo = new bootstrap.Modal(modalArchivo);
        this.unidadArchivo = idUnidad ?? 0;
        this.bootstrapModalRegistroArchivo.show();
    }

    buscarPorObservacion(): void {
        if (this.observacion.trim() === '') {
            this.sweet.alertaGeneral('warning', 'Campo vacío', 'Por favor ingrese una observación para buscar.');
            return;
        }

        this.httpUnidades.buscarPorObservacionUnidadActiva(this.observacion).subscribe(unidades => {
            console.log(unidades);

            if (unidades.statusCode == 200) {
               this.listaUnidades = unidades;
            }

            this.closeModal();

        });
    }

    closeModal():void{
        if (this.modalInstance) {

            this.modalInstance.hide();
        }
    }


    listadoDependenciasPadre():void{
        this.httpUnidades.getListadoPadresUnidadesActivas().subscribe(unidadesPadre => {
            this.padresUnidad = [
                { opciones: unidadesPadre.data, seleccion: null }
            ];
        });
    }

    onSeleccionarDependencia(nivelIndex: number, event: Event): void {
        const selectElement = event.target as HTMLSelectElement;
        const idPadre: number = parseInt(selectElement.value, 10);
        this.padre = idPadre;
        this.getLListadoUnidadesActivas();

        this.padresUnidad[nivelIndex].seleccion = idPadre;
        this.padresUnidad = this.padresUnidad.slice(0, nivelIndex + 1);
        this.httpUnidades.getListadoPadresHijasActivas(idPadre).subscribe(hijos => {
          console.log(hijos);

          if (hijos.data && hijos.data.length > 0) {
              this.padresUnidad.push({ opciones: hijos.data, seleccion: null });
          } else {
              // Si no hay hijos, significa que llegamos al último nivel - mostrar desglose
              this.desgloseUnidad(idPadre);
          }
        });
    }

    desgloseUnidad(unidad: number): void {
        this.unidadDesglose = unidad;
        this.archivoNoRegistrado = false;
        this.httpUnidadesActivas.getResumenAlmacenamiento(unidad).subscribe({
            next: (resumen) => {
                // Normalizar los datos para que funcionen en ambos formatos (camelCase y lowercase)
                if (resumen.data && resumen.data.length > 0) {
                    const datos: any = resumen.data[0];
                    resumen.data[0] = {
                        ...datos,
                        cantidadCuerpos: datos.cantidadCuerpos || datos.cantidadcuerpos,
                        cantidadEstante: datos.cantidadEstante || datos.cantidadestante,
                        cantidadBaldas: datos.cantidadBaldas || datos.cantidadbaldas,
                        sumaCajas: datos.sumaCajas || datos.sumacajas,
                        sumaCarpetas: datos.sumaCarpetas || datos.sumacarpetas,
                        sumaFolios: datos.sumaFolios || datos.sumafolios,
                        bodega: datos.bodega,
                        unidad: datos.unidad,
                        ubicacion: datos.ubicacion,
                        direccion: datos.direccion,
                        edificio: datos.edificio,
                        piso: datos.piso
                    };
                }

                this.resumenAlmacenamiento = resumen;
                if (resumen.data && resumen.data.length > 0) {
                    this.httpUnidadesActivas.getEstgructuraArchivoUnidadActiva(unidad).subscribe({
                        next: (estructura) => {
                            if (estructura.data && estructura.data.length > 0) {
                                this.folders = estructura.data.map((item) => ({
                                    name: item.nombre,
                                    expanded: false,
                                    children: [],
                                    childrenLoaded: false,
                                    cuerpoId: item.id,
                                    bodega: resumen.data[0].bodega
                                }));
                                this.archivoNoRegistrado = false;
                                this.mostrarDesglose = true;
                            } else {
                                // No hay estructura de archivo
                                this.archivoNoRegistrado = true;
                                this.mostrarDesglose = true;
                            }
                        },
                        error: (error) => {
                            console.error('Error al obtener la estructura del archivo:', error);
                            this.sweet.alertaGeneral('error', 'Error', 'No se pudo obtener la estructura del archivo.');
                        }
                    });
                } else {
                    // No hay resumen de almacenamiento
                    this.archivoNoRegistrado = true;
                    this.mostrarDesglose = true;
                }
            },
            error: (error) => {
                console.error('Error al obtener el resumen de almacenamiento:', error);
                this.sweet.alertaGeneral('error', 'Error', 'No se pudo obtener el resumen de almacenamiento.');
            }
        });
    }

    public cargarEstantes(folder: FolderNiveles, idUnidad: number): void {
        console.log('cargarEstantes called with cuerpoId:', folder.cuerpoId, 'idUnidad:', idUnidad);
        if (folder.childrenLoaded || !folder.cuerpoId) {
            console.log('Returning early - childrenLoaded:', folder.childrenLoaded);
            return;
        }

        this.httpUnidadesActivas.getEstantes(idUnidad, folder.cuerpoId).subscribe({
            next: (respuesta) => {
                console.log('Estantes response:', respuesta);
                console.log('Estantes data items:', respuesta.data);
                if (respuesta.data && respuesta.data.length > 0) {
                    respuesta.data.forEach((item: any, idx: number) => {
                        console.log(`Item ${idx}:`, item, 'Keys:', Object.keys(item));
                    });
                    folder.children = respuesta.data.map((item: any) => {
                        // Manejar variaciones de case en los nombres de campos
                        const estanteId = item.idEstante || item.idestante || item.id || item.ID;
                        const estanteName = item.estante || item.nombre || 'Estante';
                        console.log('Estante mapping:', { original: item, estanteId, estanteName });

                        return {
                            name: `${estanteName}`,
                            expanded: false,
                            children: [],
                            childrenLoaded: false,
                            estanteId: estanteId,
                            cuerpoId: folder.cuerpoId,
                            parent: folder
                        };
                    });
                    folder.childrenLoaded = true;
                    this.cdr.markForCheck();
                }
            },
            error: (error) => {
                console.error('Error al cargar estantes:', error);
                this.sweet.alertaGeneral('error', 'Error', 'No se pudieron cargar los estantes.');
            }
        });
    }

    public cargarBaldas(folder: FolderNiveles, idUnidad: number): void {
        console.log('cargarBaldas called with estanteId:', folder.estanteId);
        if (folder.childrenLoaded || !folder.estanteId) return;

        this.httpUnidadesActivas.getBaldas(idUnidad, folder.estanteId).subscribe({
            next: (respuesta) => {
                console.log('Baldas response:', respuesta);
                if (respuesta.data && respuesta.data.length > 0) {
                    folder.children = respuesta.data.map((item: any) => {
                        // Manejar variaciones de case en los nombres de campos
                        const baldaId = item.idBalda || item.idbalda || item.id || item.ID;
                        const baldaName = item.balda || item.nombre || 'Balda';
                        console.log('Balda mapping:', { original: item, baldaId, baldaName });

                        return {
                            name: `${baldaName}`,
                            expanded: false,
                            children: [],
                            childrenLoaded: false,
                            baldaId: baldaId,
                            estanteId: folder.estanteId,
                            parent: folder
                        };
                    });
                    folder.childrenLoaded = true;
                    this.cdr.markForCheck();
                }
            },
            error: (error) => {
                console.error('Error al cargar baldas:', error);
                this.sweet.alertaGeneral('error', 'Error', 'No se pudieron cargar las baldas.');
            }
        });
    }

    public cargarCajas(folder: FolderNiveles, idUnidad: number): void {
        console.log('cargarCajas called with baldaId:', folder.baldaId);
        if (folder.childrenLoaded || !folder.baldaId) return;

        this.httpUnidadesActivas.getCajasPorBaldas(idUnidad, folder.baldaId).subscribe({
            next: (respuesta) => {
                console.log('Cajas response:', respuesta);
                if (respuesta.data && respuesta.data.length > 0) {
                    folder.children = respuesta.data.map((item: any) => {
                        // Manejar variaciones de case en los nombres de campos
                        const cajaId = item.id || item.ID || item.idCaja || item.idcaja;
                        const cajaName = item.nombre || item.nombre || item.codigo || item.codigoCaja || 'Caja';
                        console.log('Caja mapping:', { original: item, cajaId, cajaName });

                        return {
                            name: `${cajaName}`,
                            expanded: false,
                            children: [],
                            childrenLoaded: false,
                            cajaId: cajaId,
                            baldaId: folder.baldaId,
                            parent: folder
                        };
                    });
                    folder.childrenLoaded = true;

                    // Cargar información detallada de cada caja
                    folder.children.forEach(caja => {
                        this.httpUnidadesActivas.infoCaja(idUnidad, caja.cajaId!).subscribe({
                            next: (infoCaja) => {
                                console.log('Info caja completa:', infoCaja);
                                if (infoCaja && infoCaja.data) {
                                    const datos: any = infoCaja.data;

                                    // Manejar ambos formatos (camelCase y lowercase)
                                    const codigoCaja = datos.codigoCaja || datos.codigocaja || '-';
                                    const cantidadLibros = datos.cantidadLibros || datos.cantidadlibros || '0';
                                    const cantidadCarpetas = datos.cantidadCarpetas || datos.cantidadcarpetas || '0';
                                    const numeroConsecutivoBodega = datos.numeroConsecutivoBodega || datos.numeroconsecutivobodega || '-';
                                    const numeroCorrelativoDependencia = datos.numeroCorrelativoDependencia || datos.numerocorrelativodependencia || '-';
                                    const anioCaja = datos.anioCaja || datos.aniocaja || new Date().getFullYear().toString();

                                    // Obtener nombres de padres del API (manejar ambos formatos)
                                    const nombreBalda = datos.nombreBalda || datos.nombrebalda || null;
                                    const nombreEstante = datos.nombreEstante || datos.nombreestante || null;
                                    const nombreCuerpo = datos.nombreCuerpo || datos.nombrecuerpo || null;

                                    console.log('Datos completos de infoCaja:', datos);
                                    console.log('Nombres obtenidos:', { nombreBalda, nombreEstante, nombreCuerpo });
                                    console.log('Parent references:', { parent: caja.parent?.name, parentParent: caja.parent?.parent?.name, parentParentParent: caja.parent?.parent?.parent?.name });

                                    caja.name = `${codigoCaja}`;
                                    caja.cajas = parseInt(cantidadLibros as string) || 0;
                                    caja.carpetas = parseInt(cantidadCarpetas as string) || 0;
                                    caja.consecutivoBodega = numeroConsecutivoBodega;
                                    caja.correlativoDependencia = numeroCorrelativoDependencia;
                                    caja.anios = anioCaja;

                                    // Actualizar nombres de padres
                                    if (nombreBalda && caja.parent) {
                                        caja.parent.name = `${nombreBalda}`;
                                    }
                                    if (nombreEstante && caja.parent?.parent) {
                                        caja.parent.parent.name = `${nombreEstante}`;
                                    }
                                    if (nombreCuerpo && caja.parent?.parent?.parent) {
                                        caja.parent.parent.parent.name = `${nombreCuerpo}`;
                                    }

                                    console.log('Caja actualizada:', caja);
                                    this.cdr.markForCheck();
                                } else {
                                    console.warn('No hay datos en la respuesta de infoCaja');
                                }
                            },
                            error: (error) => {
                                console.error('Error al cargar info caja:', error);
                            }
                        });
                    });

                    this.cdr.markForCheck();
                }
            },
            error: (error) => {
                console.error('Error al cargar cajas:', error);
                this.sweet.alertaGeneral('error', 'Error', 'No se pudieron cargar las cajas.');
            }
        });
    }

    public cargarCarpetas(folder: FolderNiveles, idUnidad: number): void {
        console.log('cargarCarpetas called with cajaId:', folder.cajaId);
        if (folder.childrenLoaded || !folder.cajaId) return;

        this.httpUnidadesActivas.GetCarpetasPorCaja(idUnidad, folder.cajaId).subscribe({
            next: (respuesta) => {
                console.log('Carpetas response:', respuesta);
                if (respuesta.data && respuesta.data.length > 0) {
                    folder.children = respuesta.data.map((item: any) => {
                        // Manejar variaciones de case en los nombres de campos
                        const carpetaId = item.carpeta || item.id || item.ID || item.idCarpeta || item.idcarpeta;
                        const carpetaName = item.carpeta || item.numero || item.numeroCarpeta || item.codigo || 'Carpeta';
                        console.log('Carpeta mapping:', { original: item, carpetaId, carpetaName });

                        return {
                            name: `CARPETA ${carpetaName}`,
                            expanded: false,
                            children: [],
                            childrenLoaded: true,
                            carpetaId: carpetaId
                        };
                    });
                    folder.childrenLoaded = true;

                    // Cargar información detallada de cada carpeta
                    folder.children.forEach((carpeta) => {
                        this.httpUnidadesActivas.getInformacionCarpeta(idUnidad, carpeta.carpetaId!).subscribe({
                            next: (infoCarpeta) => {
                                console.log('Info carpeta:', infoCarpeta);
                                if (infoCarpeta && infoCarpeta.data) {
                                    const datos: any = infoCarpeta.data;

                                    // Manejar ambos formatos (camelCase y lowercase)
                                    const numeroCarpeta = datos.numeroCarpeta || datos.numerocarpeta || '-';
                                    const nombreSerie = datos.nombreSerie || datos.nombreserie || '-';
                                    const nombreSubserie = datos.nombreSubserie || datos.nombresubserie || '-';
                                    const cantidadFolios = datos.cantidadFolios || datos.cantidadfolios || datos.cantidadFolio || datos.cantidadfolio || '0';
                                    const fechaExtremaInicio = datos.fechaExtremaInicio || datos.fechaextremainicio || '-';
                                    const fechaExtremaFin = datos.fechaExtremaFin || datos.fechaextremafin || '-';

                                    // Actualizar el nombre con el número de carpeta real
                                    carpeta.name = `CARPETA ${numeroCarpeta}`;
                                    carpeta.numeroCarpeta = numeroCarpeta;
                                    carpeta.nombreExpediente = nombreSerie;
                                    carpeta.serie = nombreSerie;
                                    carpeta.subseries = nombreSubserie && nombreSubserie !== '-' ? [nombreSubserie] : [];
                                    carpeta.folioPorCarpeta = parseInt(cantidadFolios as string) || 0;
                                    carpeta.fechasExtremas = `${fechaExtremaInicio} / ${fechaExtremaFin}`;
                                    this.cdr.markForCheck();
                                }
                            },
                            error: (error) => {
                                console.error('Error al cargar info carpeta:', error);
                            }
                        });
                    });

                    this.cdr.markForCheck();
                }
            },
            error: (error) => {
                console.error('Error al cargar carpetas:', error);
                this.sweet.alertaGeneral('error', 'Error', 'No se pudieron cargar las carpetas.');
            }
        });
    }



}
