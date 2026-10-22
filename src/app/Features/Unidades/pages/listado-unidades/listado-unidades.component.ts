import { Component, ElementRef, OnInit, inject, viewChild } from '@angular/core';
import { DependenciaServiceService } from '../../../Usuarios/services/dependencia-service.service';
import { DatumUnidad, GetAllUnidades } from '../../interfaces/get-all-unidades';
import { UnidadesService } from '../../services/unidades.service';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ModalEditarUnidadComponent } from "../../components/modal-editar-unidad/modal-editar-unidad.component";
import { SweetAlertService } from '../../../../Core/services/sweet-alert.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../../../Auth/services/login.service';
import { Modal } from 'bootstrap';
import { UnidadesActivasService } from '../../services/unidades-activas.service';
import { BuscarDetalleDocumentoFuidDatum } from '../../interfaces/buscar-detalle-documento-fuid';
import OrganizacionTransferenciaUnidadInactivaComponent from '../../components/organizacion-transferencia-unidad-inactiva/organizacion-transferencia-unidad-inactiva.component';

declare var bootstrap: any;
const ESTADO_UNIDAD_SUPRIMIDA = '6';

@Component({
  selector: 'app-listado-unidades',
  imports: [RouterModule, RouterLink, NgFor, NgIf, NgClass, DatePipe, ModalEditarUnidadComponent, FormsModule, OrganizacionTransferenciaUnidadInactivaComponent],
  templateUrl: './listado-unidades.component.html',
  styleUrl: './listado-unidades.component.css'
})
export default class ListadoUnidadesComponent implements OnInit{

    public listaUnidades: GetAllUnidades = {
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

    public bootstrapModal: any;
    public pagina:number = 1;
    public totalRegistros:number = 0;
    public registrosPorPagina:number = 0;
    public totalPaginas:number = 0;
    public unidad!: DatumUnidad;

    public filterPost: string = '';
    public rolUser: number = 0;
    private dependencia: number = 0;

    // Filtros de dependencias
    public nivelesDependencias: Array<{ opciones: any[]; seleccion: any }> = [];
    public observacion: string = '';
    public unidadOrganizacion: number = 0;

    private modalInstance: Modal | null = null;
    private modalActualizar = viewChild<ElementRef>('buscarObservacion');

    // Búsqueda de documentos FUID (solo unidades suprimidas)
    private router = inject(Router);
    private httpUnidadesActivas = inject(UnidadesActivasService);
    private modalBuscarDocumentoRef = viewChild<ElementRef>('buscarDocumento');
    private modalBuscarDocumento: Modal | null = null;
    public filtroBusquedaDocumento = this.filtroDocumentoVacio();
    public resultadosBusquedaDocumento: BuscarDetalleDocumentoFuidDatum[] = [];
    public busquedaDocumentoRealizada: boolean = false;

    constructor(
        private httUnidades: UnidadesService,
        private sweet: SweetAlertService,
        private dependenciaService: DependenciaServiceService,
        private httpLogin: LoginService
    ){
        const sesion = this.httpLogin.datosSesion();
        this.rolUser = sesion.idTipoUsuario;
        this.dependencia = sesion.idDependencia;


    }

    ngOnInit(): void {
        if (this.rolUser != 1) {
            this.getAllUnidades(this.pagina, this.dependencia);
        }else{
            this.getAllUnidades(this.pagina);
        }
        this.listadoDependenciasPadre();
    }

    listadoDependenciasPadre():void{
        this.dependenciaService.getListadoUnidadesPadres().subscribe(dependencias => {
            this.nivelesDependencias = [
                { opciones: dependencias.data, seleccion: null }
            ];
        });
    }

    onSeleccionarDependencia(nivelIndex: number, event: Event): void {
        const selectElement = event.target as HTMLSelectElement;
        const idPadre: number = parseInt(selectElement.value, 10);
        this.getAllUnidades(this.pagina, idPadre);

        this.nivelesDependencias[nivelIndex].seleccion = idPadre;
        this.nivelesDependencias = this.nivelesDependencias.slice(0, nivelIndex + 1);
        this.dependenciaService.getListadoUnidadesHijas(idPadre).subscribe(hijos => {
            if (hijos.data && hijos.data.length > 0) {
                this.nivelesDependencias.push({ opciones: hijos.data, seleccion: null });
            }
        });
        // Aquí podrías llamar a filtrarUnidades() si quieres filtrar automáticamente
    }

    getAllUnidades(pagina: number = 1, idDependencia: number = 0):void{
        this.httUnidades.getAllUnidades(pagina, idDependencia, this.filterPost).subscribe(unidades =>{
            if (unidades.data.length == 0) {
                this.listaUnidades = {
                    ...this.listaUnidades,
                    data: [],
                    mensaje: 'No hay registros para mostrar.'
                };
                this.pagina = 0;
            }else{
                this.listaUnidades = unidades;
                this.pagina = unidades.infoPagination.pagina;
            }
        });
    }

    cambiarPagina(pagina: number):void{
        if (pagina >= 1 && pagina <= this.listaUnidades.infoPagination.totalPaginas) {
            this.getAllUnidades(pagina);
        }
    }

    abrirModal(unidad: DatumUnidad):void{
        const modal = document.getElementById('modalEditarUnidades');
        this.bootstrapModal = new bootstrap.Modal(modal);
        this.unidad = unidad;
        this.bootstrapModal.show();
    }

    editarEstado(estadoACtual: number, idUnidad: number):void{
        let estado = (estadoACtual === 1) ? 2 : 1;
        this.httUnidades.updateEstadoUnidad(estado, idUnidad).subscribe(updateEstado =>{
            this.sweet.alertaGeneral(updateEstado.icono, updateEstado.titulo, updateEstado.mensaje);
            this.getAllUnidades(1);
        });
    }

    abrirModalOrganizacionTransferencia(idUnidad: number): void {
        const modal = document.getElementById('modalOrganizacionTransferencia');
        this.unidadOrganizacion = idUnidad ?? 0;
        new bootstrap.Modal(modal).show();
    }

    abrirModalBuscarDocumento(): void {
        this.filtroBusquedaDocumento = this.filtroDocumentoVacio();
        this.resultadosBusquedaDocumento = [];
        this.busquedaDocumentoRealizada = false;
        const modal = this.modalBuscarDocumentoRef();
        if (modal) {
            this.modalBuscarDocumento = new Modal(modal.nativeElement);
            this.modalBuscarDocumento.show();
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

        // Solo documentos de unidades suprimidas
        filtros['estado_unidad'] = ESTADO_UNIDAD_SUPRIMIDA;

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

    /** Abre el detalle de la unidad en la pestaña de ubicación, desplegado hasta la carpeta del documento. */
    irADocumentoEncontrado(resultado: BuscarDetalleDocumentoFuidDatum): void {
        const ubicacion = resultado.ubicacion;
        if (!ubicacion || !ubicacion.idUnidad || !ubicacion.idCuerpo || !ubicacion.idEstante || !ubicacion.idBalda || !ubicacion.idCaja || !ubicacion.idCarpeta) {
            this.sweet.alertaGeneral('warning', 'Ubicación incompleta', 'No se pudo determinar la ubicación completa de este documento.');
            return;
        }

        const navegar = () => this.router.navigate(['/main/unidades/informacionUnidad', ubicacion.idUnidad], {
            queryParams: {
                tab: 'ubicacion',
                cuerpo: ubicacion.idCuerpo,
                estante: ubicacion.idEstante,
                balda: ubicacion.idBalda,
                caja: ubicacion.idCaja,
                carpeta: ubicacion.idCarpeta,
            }
        });

        // Se espera a que el modal termine de cerrarse para no dejar el fondo oscuro al cambiar de página
        const modal = this.modalBuscarDocumentoRef()?.nativeElement;
        if (modal && this.modalBuscarDocumento) {
            modal.addEventListener('hidden.bs.modal', navegar, { once: true });
            this.modalBuscarDocumento.hide();
        } else {
            navegar();
        }
    }

    private filtroDocumentoVacio() {
        return {
            nombre_serie_subserie_asunto: '',
            notas: '',
            codigo: '',
            numero_orden: '',
            fecha_extrema_inicio: '',
            fecha_extrema_fin: ''
        };
    }

    limpiarFiltros(): void {
        this.filterPost = '';
        this.nivelesDependencias = this.nivelesDependencias.map(nivel => ({ ...nivel, seleccion: null }));
        this.nivelesDependencias = [];
        this.listadoDependenciasPadre();
        this.getAllUnidades(1);
    }

    filtroTexto(filtro: string): void {
        this.filterPost = filtro;
        this.pagina = 0;
        this.getAllUnidades();
    }

    buscarPorObservacion(): void {
        if (this.observacion.trim() === '') {
            this.sweet.alertaGeneral('warning', 'Campo vacío', 'Por favor ingrese una observación para buscar.');
            return;
        }

        this.httUnidades.busquedaPorObservacion(this.observacion, this.dependencia).subscribe(unidades => {
            if (unidades.statusCode == 200) {
               this.listaUnidades = unidades;
            }

            this.closeModal();

        });
    }

    abrirModalBuscarObservacion():void {
        this.observacion = '';
        const modal = this.modalActualizar();
        if (modal) {
            this.modalInstance = new Modal(modal.nativeElement);
            this.modalInstance.show();
        }

    }

    closeModal():void{
        if (this.modalInstance) {
            this.modalInstance.hide();
        }
    }

}
