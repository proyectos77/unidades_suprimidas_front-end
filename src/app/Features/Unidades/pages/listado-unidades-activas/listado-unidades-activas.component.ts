import { Component, OnInit, viewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { UnidadesService } from '../../services/unidades.service';
import { GetAllListadoUnidadesActivas } from '../../interfaces/get-all-listado-unidades-activas';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
import { NgClass, NgFor, NgIf, DatePipe } from '@angular/common';
import { ModalEditarUnidadComponent } from '../../components/modal-editar-unidad/modal-editar-unidad.component';
import { RouterModule } from '@angular/router';
import { DatumUnidad } from '../../interfaces/get-all-unidades';
import { SweetAlertService } from '../../../../Core/services/sweet-alert.service';
import { LoginService } from '../../../../Auth/services/login.service';

import { ArchivoUnidadActivaComponent } from '../../components/archivo-unidad-activa/archivo-unidad-activa.component';
import { FolderNiveles } from '../../interfaces/FolderNiveles';
import RegistroArchivoUnidadActivaComponent from '../../components/registro-archivo-unidad-activa/registro-archivo-unidad-activa.component';
import { UnidadesActivasService } from '../../services/unidades-activas.service';
import { GetResumenAlmacenamiento } from '../../interfaces/get-resumen-almacenamiento';
import { DetalleDocumentoFuidDatum } from '../../interfaces/get-detalle-documento-fuid-por-carpeta';
import { BuscarDetalleDocumentoFuidDatum, UbicacionDocumentoFuid } from '../../interfaces/buscar-detalle-documento-fuid';

declare var bootstrap: any;

@Component({
  selector: 'app-listado-unidades-activas',
  imports: [RouterModule, NgFor, NgIf, NgClass, DatePipe, ModalEditarUnidadComponent, FormsModule, RegistroArchivoUnidadActivaComponent, ArchivoUnidadActivaComponent],
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
  public onDescargarDocumentoCajaCallback = (folder: FolderNiveles, idUnidad: number) => this.descargarDocumentoCaja(folder);
  public onVerDataDocumentoFuidCallback = (folder: FolderNiveles, idUnidad: number) => this.verDataDocumentoFuid(folder);

  public documentosDataFuid: DetalleDocumentoFuidDatum[] = [];


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

    public filtroBusquedaDocumento = {
        nombre_serie_subserie_asunto: '',
        notas: '',
        codigo: '',
        numero_orden: '',
        fecha_extrema_inicio: '',
        fecha_extrema_fin: ''
    };
    public resultadosBusquedaDocumento: BuscarDetalleDocumentoFuidDatum[] = [];
    public busquedaDocumentoRealizada: boolean = false;

    private modalInstance: Modal | null = null;
    private modalActualizar = viewChild<ElementRef>('buscarDocumento');
    private modalDataFuidRef = viewChild<ElementRef>('dataFuidModal');
    private modalInstanceDataFuid: Modal | null = null;

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
        this.filtroBusquedaDocumento = {
            nombre_serie_subserie_asunto: '',
            notas: '',
            codigo: '',
            numero_orden: '',
            fecha_extrema_inicio: '',
            fecha_extrema_fin: ''
        };
        this.resultadosBusquedaDocumento = [];
        this.busquedaDocumentoRealizada = false;
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

    buscarDocumentos(): void {
        const filtros: Record<string, string> = {};
        const campo = this.filtroBusquedaDocumento;

        if (campo.nombre_serie_subserie_asunto.trim()) filtros['nombre_serie_subserie_asunto'] = campo.nombre_serie_subserie_asunto.trim();
        if (campo.notas.trim()) filtros['notas'] = campo.notas.trim();
        if (campo.codigo.trim()) filtros['codigo'] = campo.codigo.trim();
        if (campo.numero_orden.trim()) filtros['numero_orden'] = campo.numero_orden.trim();
        if (campo.fecha_extrema_inicio) filtros['fecha_extrema_inicio'] = campo.fecha_extrema_inicio;
        if (campo.fecha_extrema_fin) filtros['fecha_extrema_fin'] = campo.fecha_extrema_fin;

        if (Object.keys(filtros).length === 0) {
            this.sweet.alertaGeneral('warning', 'Sin criterios', 'Ingrese al menos un criterio de búsqueda.');
            return;
        }

        this.httpUnidadesActivas.buscarDetalleDocumentoFuid(filtros).subscribe({
            next: (respuesta) => {
                this.resultadosBusquedaDocumento = respuesta.data || [];
                this.busquedaDocumentoRealizada = true;
            },
            error: () => {
                this.sweet.alertaGeneral('error', 'Error', 'No se pudo realizar la búsqueda.');
            }
        });
    }

    irADocumentoEncontrado(resultado: BuscarDetalleDocumentoFuidDatum): void {
        const ubicacion = resultado.ubicacion;

        if (!ubicacion || !ubicacion.idUnidad || !ubicacion.idCuerpo || !ubicacion.idEstante || !ubicacion.idBalda || !ubicacion.idCaja || !ubicacion.idCarpeta) {
            this.sweet.alertaGeneral('warning', 'Ubicación incompleta', 'No se pudo determinar la ubicación completa de este documento en el árbol.');
            return;
        }

        this.closeModal();
        this.desgloseUnidad(ubicacion.idUnidad, () => this.navegarAUbicacion(ubicacion));
    }

    private navegarAUbicacion(ubicacion: UbicacionDocumentoFuid): void {
        const idUnidad = ubicacion.idUnidad!;
        const cuerpoFolder = this.folders.find(f => f.cuerpoId === ubicacion.idCuerpo);
        if (!cuerpoFolder) {
            this.sweet.alertaGeneral('warning', 'No encontrado', 'No se pudo ubicar el cuerpo del documento en el árbol.');
            return;
        }

        cuerpoFolder.expanded = true;
        this.cargarEstantes(cuerpoFolder, idUnidad, () => {
            const estanteFolder = cuerpoFolder.children.find(f => f.estanteId === ubicacion.idEstante);
            if (!estanteFolder) return;

            estanteFolder.expanded = true;
            this.cargarBaldas(estanteFolder, idUnidad, () => {
                const baldaFolder = estanteFolder.children.find(f => f.baldaId === ubicacion.idBalda);
                if (!baldaFolder) return;

                baldaFolder.expanded = true;
                this.cargarCajas(baldaFolder, idUnidad, () => {
                    const cajaFolder = baldaFolder.children.find(f => f.cajaId === ubicacion.idCaja);
                    if (!cajaFolder) return;

                    cajaFolder.expanded = true;
                    this.cargarCarpetas(cajaFolder, idUnidad, () => {
                        const carpetaFolder = cajaFolder.children.find(f => f.carpetaId === ubicacion.idCarpeta);
                        if (carpetaFolder) {
                            carpetaFolder.expanded = true;
                        }
                        this.cdr.detectChanges();
                    });
                });
            });
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

          if (hijos.data && hijos.data.length > 0) {
              this.padresUnidad.push({ opciones: hijos.data, seleccion: null });
          } else {
              // Si no hay hijos, significa que llegamos al último nivel - mostrar desglose
              this.desgloseUnidad(idPadre);
          }
        });
    }

    desgloseUnidad(unidad: number, onFoldersLoaded?: () => void): void {
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
                                onFoldersLoaded?.();
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

    public cargarEstantes(folder: FolderNiveles, idUnidad: number, onComplete?: () => void): void {
        if (folder.childrenLoaded || !folder.cuerpoId) {
            onComplete?.();
            return;
        }

        this.httpUnidadesActivas.getEstantes(idUnidad, folder.cuerpoId).subscribe({
            next: (respuesta) => {
                if (respuesta.data && respuesta.data.length > 0) {
                    respuesta.data.forEach((item: any, idx: number) => {
                    });
                    folder.children = respuesta.data.map((item: any) => {
                        // Manejar variaciones de case en los nombres de campos
                        const estanteId = item.idEstante || item.idestante || item.id || item.ID;
                        const estanteName = item.estante || item.nombre || 'Estante';

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
                onComplete?.();
            },
            error: (error) => {
                console.error('Error al cargar estantes:', error);
                this.sweet.alertaGeneral('error', 'Error', 'No se pudieron cargar los estantes.');
            }
        });
    }

    public cargarBaldas(folder: FolderNiveles, idUnidad: number, onComplete?: () => void): void {
        if (folder.childrenLoaded || !folder.estanteId) {
            onComplete?.();
            return;
        }

        this.httpUnidadesActivas.getBaldas(idUnidad, folder.estanteId).subscribe({
            next: (respuesta) => {
                if (respuesta.data && respuesta.data.length > 0) {
                    folder.children = respuesta.data.map((item: any) => {
                        // Manejar variaciones de case en los nombres de campos
                        const baldaId = item.idBalda || item.idbalda || item.id || item.ID;
                        const baldaName = item.balda || item.nombre || 'Balda';

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
                onComplete?.();
            },
            error: (error) => {
                console.error('Error al cargar baldas:', error);
                this.sweet.alertaGeneral('error', 'Error', 'No se pudieron cargar las baldas.');
            }
        });
    }

    public cargarCajas(folder: FolderNiveles, idUnidad: number, onComplete?: () => void): void {
        if (folder.childrenLoaded || !folder.baldaId) {
            onComplete?.();
            return;
        }

        this.httpUnidadesActivas.getCajasPorBaldas(idUnidad, folder.baldaId).subscribe({
            next: (respuesta) => {
                if (respuesta.data && respuesta.data.length > 0) {
                    folder.children = respuesta.data.map((item: any) => {
                        // Manejar variaciones de case en los nombres de campos
                        const cajaId = item.id || item.ID || item.idCaja || item.idcaja;
                        const cajaName = item.nombre || item.nombre || item.codigo || item.codigoCaja || 'Caja';

                        return {
                            name: `Caja ${cajaName}`,
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


                                    caja.name = `Caja ${codigoCaja}`;
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

                                    this.cdr.markForCheck();
                                } else {
                                    console.warn('No hay datos en la respuesta de infoCaja');
                                }
                            },
                            error: (error) => {
                                console.error('Error al cargar info caja:', error);
                            }
                        });

                        this.httpUnidadesActivas.listadoDocumentosFuidPorCaja(caja.cajaId!).subscribe({
                            next: (respuesta) => {
                                const documentos = respuesta.data || [];
                                caja.tieneDocumentoFuid = documentos.some((d) => d.url_documento && d.url_documento !== 'sin-documento');
                                this.cdr.markForCheck();
                            },
                            error: () => {
                                caja.tieneDocumentoFuid = false;
                            }
                        });
                    });

                    this.cdr.markForCheck();
                }
                onComplete?.();
            },
            error: (error) => {
                console.error('Error al cargar cajas:', error);
                this.sweet.alertaGeneral('error', 'Error', 'No se pudieron cargar las cajas.');
            }
        });
    }

    public cargarCarpetas(folder: FolderNiveles, idUnidad: number, onComplete?: () => void): void {
        if (folder.childrenLoaded || !folder.cajaId) {
            onComplete?.();
            return;
        }

        this.httpUnidadesActivas.GetCarpetasPorCaja(idUnidad, folder.cajaId).subscribe({
            next: (respuesta) => {
                if (respuesta.data && respuesta.data.length > 0) {
                    folder.children = respuesta.data.map((item: any) => {
                        // Manejar variaciones de case en los nombres de campos
                        const carpetaId = item.carpeta || item.id || item.ID || item.idCarpeta || item.idcarpeta;
                        const carpetaName = item.carpeta || item.numero || item.numeroCarpeta || item.codigo || 'Carpeta';

                        return {
                            name: `Carpeta ${carpetaName}`,
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
                                    carpeta.name = `Carpeta ${numeroCarpeta}`;
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

                        this.httpUnidadesActivas.listadoDetalleDocumentoFuidPorCarpeta(carpeta.carpetaId!).subscribe({
                            next: (respuesta) => {
                                carpeta.tieneDocumentoFuid = (respuesta.data || []).length > 0;
                                this.cdr.markForCheck();
                            },
                            error: () => {
                                carpeta.tieneDocumentoFuid = false;
                            }
                        });
                    });

                    this.cdr.markForCheck();
                }
                onComplete?.();
            },
            error: (error) => {
                console.error('Error al cargar carpetas:', error);
                this.sweet.alertaGeneral('error', 'Error', 'No se pudieron cargar las carpetas.');
            }
        });
    }

    public descargarDocumentoCaja(folder: FolderNiveles): void {
        if (!folder.cajaId) return;

        this.httpUnidadesActivas.listadoDocumentosFuidPorCaja(folder.cajaId).subscribe({
            next: (respuesta) => {
                const documentos = respuesta.data || [];
                const documentoConArchivo = documentos.find((d) => d.url_documento && d.url_documento !== 'sin-documento');

                if (!documentoConArchivo) {
                    this.sweet.alertaGeneral('warning', 'Sin documento', 'Esta caja no tiene un Excel asociado.');
                    return;
                }

                const url = this.httpUnidadesActivas.obtenerUrlDescargaDocumentoFuid(documentoConArchivo.id_documento_general);
                window.open(url, '_blank');
            },
            error: () => {
                this.sweet.alertaGeneral('error', 'Error', 'No se pudo obtener el Excel de la caja.');
            }
        });
    }

    public verDataDocumentoFuid(folder: FolderNiveles): void {
        if (!folder.carpetaId) return;

        this.httpUnidadesActivas.listadoDetalleDocumentoFuidPorCarpeta(folder.carpetaId).subscribe({
            next: (respuesta) => {
                this.documentosDataFuid = respuesta.data || [];
                this.cdr.detectChanges();

                const modal = this.modalDataFuidRef();
                if (modal) {
                    this.modalInstanceDataFuid = new Modal(modal.nativeElement);
                    this.modalInstanceDataFuid.show();
                }
            },
            error: () => {
                this.sweet.alertaGeneral('error', 'Error', 'No se pudo obtener la información del documento fuid.');
            }
        });
    }

}
