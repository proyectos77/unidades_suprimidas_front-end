import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, SimpleChanges, viewChild } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
import { ArchivoUnidadActivaComponent } from '../archivo-unidad-activa/archivo-unidad-activa.component';
import { FolderNiveles } from '../../interfaces/FolderNiveles';
import { UnidadesActivasService } from '../../services/unidades-activas.service';
import { SweetAlertService } from '../../../../Core/services/sweet-alert.service';
import { GetResumenAlmacenamiento } from '../../interfaces/get-resumen-almacenamiento';
import { DetalleDocumentoFuidDatum } from '../../interfaces/get-detalle-documento-fuid-por-carpeta';
import { BuscarDetalleDocumentoFuidDatum, UbicacionDocumentoFuid } from '../../interfaces/buscar-detalle-documento-fuid';

/**
 * Ubicación física del archivo de una unidad (resumen, árbol cuerpo/estante/balda/caja/carpeta,
 * buscador de documentos FUID limitado a la unidad y detalle FUID por carpeta).
 * Misma lógica que el desglose del listado de unidades activas, encapsulada para reutilizarla.
 */
@Component({
  selector: 'app-ubicacion-archivo-unidad',
  imports: [NgIf, NgFor, DatePipe, FormsModule, ArchivoUnidadActivaComponent],
  templateUrl: './ubicacion-archivo-unidad.component.html',
  styleUrl: './ubicacion-archivo-unidad.component.css'
})
export class UbicacionArchivoUnidadComponent implements OnChanges {

    @Input() idUnidad: number = 0;
    /** Ubicación a la que se navega al cargar el árbol (p. ej. al venir del buscador del listado). */
    @Input() ubicacionInicial: UbicacionDocumentoFuid | null = null;

    public cargando: boolean = false;
    public archivoNoRegistrado: boolean = false;
    public resumenAlmacenamiento: GetResumenAlmacenamiento | null = null;
    public folders: FolderNiveles[] = [];
    public documentosDataFuid: DetalleDocumentoFuidDatum[] = [];

    public filtroBusquedaDocumento = this.filtroVacio();
    public resultadosBusquedaDocumento: BuscarDetalleDocumentoFuidDatum[] = [];
    public busquedaDocumentoRealizada: boolean = false;

    // Callbacks para lazy-loading del árbol
    public onLoadEstantesCallback = (folder: FolderNiveles, idUnidad: number) => this.cargarEstantes(folder, idUnidad);
    public onLoadBaldasCallback = (folder: FolderNiveles, idUnidad: number) => this.cargarBaldas(folder, idUnidad);
    public onLoadCajasCallback = (folder: FolderNiveles, idUnidad: number) => this.cargarCajas(folder, idUnidad);
    public onLoadCarpetasCallback = (folder: FolderNiveles, idUnidad: number) => this.cargarCarpetas(folder, idUnidad);
    public onDescargarDocumentoCajaCallback = (folder: FolderNiveles) => this.descargarDocumentoCaja(folder);
    public onVerDataDocumentoFuidCallback = (folder: FolderNiveles) => this.verDataDocumentoFuid(folder);

    private modalBuscarRef = viewChild<ElementRef>('buscarDocumento');
    private modalDataFuidRef = viewChild<ElementRef>('dataFuidModal');
    private modalBuscar: Modal | null = null;

    constructor(
        private httpUnidadesActivas: UnidadesActivasService,
        private sweet: SweetAlertService,
        private cdr: ChangeDetectorRef,
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['idUnidad'] && this.idUnidad) {
            this.cargarUbicacion(() => {
                if (this.ubicacionInicial) {
                    this.navegarAUbicacion(this.ubicacionInicial);
                }
            });
        }
    }

    cargarUbicacion(onFoldersLoaded?: () => void): void {
        this.cargando = true;
        this.archivoNoRegistrado = false;
        this.folders = [];

        this.httpUnidadesActivas.getResumenAlmacenamiento(this.idUnidad).subscribe({
            next: (resumen) => {
                if (resumen.data && resumen.data.length > 0) {
                    // Normalizar los datos para que funcionen en ambos formatos (camelCase y lowercase)
                    const datos: any = resumen.data[0];
                    resumen.data[0] = {
                        ...datos,
                        cantidadCuerpos: datos.cantidadCuerpos || datos.cantidadcuerpos,
                        cantidadEstante: datos.cantidadEstante || datos.cantidadestante,
                        cantidadBaldas: datos.cantidadBaldas || datos.cantidadbaldas,
                        sumaCajas: datos.sumaCajas || datos.sumacajas,
                        sumaCarpetas: datos.sumaCarpetas || datos.sumacarpetas,
                        sumaFolios: datos.sumaFolios || datos.sumafolios,
                    };
                }
                this.resumenAlmacenamiento = resumen;

                if (!resumen.data || resumen.data.length === 0) {
                    this.archivoNoRegistrado = true;
                    this.cargando = false;
                    return;
                }

                this.httpUnidadesActivas.getEstgructuraArchivoUnidadActiva(this.idUnidad).subscribe({
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
                            onFoldersLoaded?.();
                        } else {
                            this.archivoNoRegistrado = true;
                        }
                        this.cargando = false;
                    },
                    error: () => {
                        this.cargando = false;
                        this.sweet.alertaGeneral('error', 'Error', 'No se pudo obtener la estructura del archivo.');
                    }
                });
            },
            error: () => {
                this.cargando = false;
                this.archivoNoRegistrado = true;
            }
        });
    }

    /*--*************** Buscador de documentos ***************--*/
    abrirModalBuscarDocumento(): void {
        this.filtroBusquedaDocumento = this.filtroVacio();
        this.resultadosBusquedaDocumento = [];
        this.busquedaDocumentoRealizada = false;
        const modal = this.modalBuscarRef();
        if (modal) {
            this.modalBuscar = new Modal(modal.nativeElement);
            this.modalBuscar.show();
        }
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

        // La búsqueda se limita al archivo de esta unidad
        filtros['id_unidad'] = String(this.idUnidad);

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

        if (!ubicacion || !ubicacion.idCuerpo || !ubicacion.idEstante || !ubicacion.idBalda || !ubicacion.idCaja || !ubicacion.idCarpeta) {
            this.sweet.alertaGeneral('warning', 'Ubicación incompleta', 'No se pudo determinar la ubicación completa de este documento en el árbol.');
            return;
        }

        this.modalBuscar?.hide();
        this.colapsar(this.folders);
        this.navegarAUbicacion(ubicacion);
    }

    private navegarAUbicacion(ubicacion: UbicacionDocumentoFuid): void {
        const idUnidad = this.idUnidad;
        const coincideId = (valor: any, objetivo: any) => valor != null && objetivo != null && String(valor) === String(objetivo);

        const cuerpoFolder = this.folders.find(f => coincideId(f.cuerpoId, ubicacion.idCuerpo));
        if (!cuerpoFolder) {
            this.sweet.alertaGeneral('warning', 'No encontrado', 'No se pudo ubicar el cuerpo del documento en el árbol.');
            return;
        }

        cuerpoFolder.expanded = true;
        this.cargarEstantes(cuerpoFolder, idUnidad, () => {
            const estanteFolder = cuerpoFolder.children.find(f => coincideId(f.estanteId, ubicacion.idEstante));
            if (!estanteFolder) return;

            estanteFolder.expanded = true;
            this.cargarBaldas(estanteFolder, idUnidad, () => {
                const baldaFolder = estanteFolder.children.find(f => coincideId(f.baldaId, ubicacion.idBalda));
                if (!baldaFolder) return;

                baldaFolder.expanded = true;
                this.cargarCajas(baldaFolder, idUnidad, () => {
                    const cajaFolder = baldaFolder.children.find(f => coincideId(f.cajaId, ubicacion.idCaja));
                    if (!cajaFolder) return;

                    cajaFolder.expanded = true;
                    this.cargarCarpetas(cajaFolder, idUnidad, () => {
                        const carpetaFolder = cajaFolder.children.find(f => coincideId(f.carpetaId, ubicacion.idCarpeta));
                        if (carpetaFolder) {
                            carpetaFolder.expanded = true;
                        }
                        this.cdr.detectChanges();
                    });
                });
            });
        });
    }

    private colapsar(folders: FolderNiveles[]): void {
        folders.forEach(f => {
            f.expanded = false;
            this.colapsar(f.children || []);
        });
    }

    private filtroVacio() {
        return {
            nombre_serie_subserie_asunto: '',
            notas: '',
            codigo: '',
            numero_orden: '',
            fecha_extrema_inicio: '',
            fecha_extrema_fin: ''
        };
    }

    /*--*************** Carga del árbol ***************--*/
    public cargarEstantes(folder: FolderNiveles, idUnidad: number, onComplete?: () => void): void {
        if (folder.childrenLoaded || !folder.cuerpoId) {
            onComplete?.();
            return;
        }

        this.httpUnidadesActivas.getEstantes(idUnidad, folder.cuerpoId).subscribe({
            next: (respuesta) => {
                if (respuesta.data && respuesta.data.length > 0) {
                    folder.children = respuesta.data.map((item: any) => ({
                        name: `${item.estante || item.nombre || 'Estante'}`,
                        expanded: false,
                        children: [],
                        childrenLoaded: false,
                        estanteId: item.idEstante || item.idestante || item.id || item.ID,
                        cuerpoId: folder.cuerpoId,
                        parent: folder
                    }));
                    folder.childrenLoaded = true;
                    this.cdr.markForCheck();
                }
                onComplete?.();
            },
            error: () => {
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
                    folder.children = respuesta.data.map((item: any) => ({
                        name: `${item.balda || item.nombre || 'Balda'}`,
                        expanded: false,
                        children: [],
                        childrenLoaded: false,
                        baldaId: item.idBalda || item.idbalda || item.id || item.ID,
                        estanteId: folder.estanteId,
                        parent: folder
                    }));
                    folder.childrenLoaded = true;
                    this.cdr.markForCheck();
                }
                onComplete?.();
            },
            error: () => {
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
                    folder.children = respuesta.data.map((item: any) => ({
                        name: `Caja ${item.nombre || item.codigo || item.codigoCaja || 'Caja'}`,
                        expanded: false,
                        children: [],
                        childrenLoaded: false,
                        cajaId: item.id || item.ID || item.idCaja || item.idcaja,
                        baldaId: folder.baldaId,
                        parent: folder
                    }));
                    folder.childrenLoaded = true;

                    // Información detallada de cada caja
                    folder.children.forEach(caja => {
                        this.httpUnidadesActivas.infoCaja(idUnidad, caja.cajaId!).subscribe({
                            next: (infoCaja) => {
                                if (!infoCaja || !infoCaja.data) return;
                                const datos: any = infoCaja.data;

                                caja.name = `Caja ${datos.codigoCaja || datos.codigocaja || '-'}`;
                                caja.cajas = parseInt(datos.cantidadLibros || datos.cantidadlibros || '0') || 0;
                                caja.carpetas = parseInt(datos.cantidadCarpetas || datos.cantidadcarpetas || '0') || 0;
                                caja.consecutivoBodega = datos.numeroConsecutivoBodega || datos.numeroconsecutivobodega || '-';
                                caja.correlativoDependencia = datos.numeroCorrelativoDependencia || datos.numerocorrelativodependencia || '-';
                                caja.anios = datos.anioCaja || datos.aniocaja || '-';

                                const nombreBalda = datos.nombreBalda || datos.nombrebalda || null;
                                const nombreEstante = datos.nombreEstante || datos.nombreestante || null;
                                const nombreCuerpo = datos.nombreCuerpo || datos.nombrecuerpo || null;
                                if (nombreBalda && caja.parent) caja.parent.name = `${nombreBalda}`;
                                if (nombreEstante && caja.parent?.parent) caja.parent.parent.name = `${nombreEstante}`;
                                if (nombreCuerpo && caja.parent?.parent?.parent) caja.parent.parent.parent.name = `${nombreCuerpo}`;

                                this.cdr.markForCheck();
                            }
                        });

                        this.httpUnidadesActivas.listadoDocumentosFuidPorCaja(caja.cajaId!).subscribe({
                            next: (respuestaDocs) => {
                                caja.tieneDocumentoFuid = (respuestaDocs.data || []).some((d) => d.url_documento && d.url_documento !== 'sin-documento');
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
            error: () => {
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
                        const carpeta = item.carpeta || item.id || item.ID || item.idCarpeta || item.idcarpeta;
                        return {
                            name: `Carpeta ${item.carpeta || item.numero || item.numeroCarpeta || item.codigo || 'Carpeta'}`,
                            expanded: false,
                            children: [],
                            childrenLoaded: true,
                            carpetaId: carpeta
                        };
                    });
                    folder.childrenLoaded = true;

                    // Información detallada de cada carpeta
                    folder.children.forEach((carpeta) => {
                        this.httpUnidadesActivas.getInformacionCarpeta(idUnidad, carpeta.carpetaId!).subscribe({
                            next: (infoCarpeta) => {
                                if (!infoCarpeta || !infoCarpeta.data) return;
                                const datos: any = infoCarpeta.data;

                                const numeroCarpeta = datos.numeroCarpeta || datos.numerocarpeta || '-';
                                const nombreSerie = datos.nombreSerie || datos.nombreserie || '-';
                                const nombreSubserie = datos.nombreSubserie || datos.nombresubserie || '-';
                                const cantidadFolios = datos.cantidadFolios || datos.cantidadfolios || datos.cantidadFolio || datos.cantidadfolio || '0';
                                const fechaExtremaInicio = datos.fechaExtremaInicio || datos.fechaextremainicio || '-';
                                const fechaExtremaFin = datos.fechaExtremaFin || datos.fechaextremafin || '-';

                                carpeta.name = `Carpeta ${numeroCarpeta}`;
                                carpeta.numeroCarpeta = numeroCarpeta;
                                carpeta.nombreExpediente = nombreSerie;
                                carpeta.serie = nombreSerie;
                                carpeta.subseries = nombreSubserie && nombreSubserie !== '-' ? [nombreSubserie] : [];
                                carpeta.folioPorCarpeta = parseInt(cantidadFolios as string) || 0;
                                carpeta.fechasExtremas = `${fechaExtremaInicio} / ${fechaExtremaFin}`;
                                this.cdr.markForCheck();
                            }
                        });

                        this.httpUnidadesActivas.listadoDetalleDocumentoFuidPorCarpeta(carpeta.carpetaId!).subscribe({
                            next: (respuestaFuid) => {
                                carpeta.tieneDocumentoFuid = (respuestaFuid.data || []).length > 0;
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
            error: () => {
                this.sweet.alertaGeneral('error', 'Error', 'No se pudieron cargar las carpetas.');
            }
        });
    }

    /*--*************** Documento FUID ***************--*/
    public descargarDocumentoCaja(folder: FolderNiveles): void {
        if (!folder.cajaId) return;

        this.httpUnidadesActivas.listadoDocumentosFuidPorCaja(folder.cajaId).subscribe({
            next: (respuesta) => {
                const documentoConArchivo = (respuesta.data || []).find((d) => d.url_documento && d.url_documento !== 'sin-documento');
                if (!documentoConArchivo) {
                    this.sweet.alertaGeneral('warning', 'Sin documento', 'Esta caja no tiene un Excel asociado.');
                    return;
                }
                window.open(this.httpUnidadesActivas.obtenerUrlDescargaDocumentoFuid(documentoConArchivo.id_documento_general), '_blank');
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
                this.documentosDataFuid = (respuesta.data || []).sort((a, b) => Number(a.numero_orden) - Number(b.numero_orden));
                this.cdr.detectChanges();

                const modal = this.modalDataFuidRef();
                if (modal) {
                    new Modal(modal.nativeElement).show();
                }
            },
            error: () => {
                this.sweet.alertaGeneral('error', 'Error', 'No se pudo obtener la información del documento fuid.');
            }
        });
    }
}
