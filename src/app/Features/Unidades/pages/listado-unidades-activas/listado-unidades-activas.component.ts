import { Component, OnInit, viewChild, ElementRef, OnChanges } from '@angular/core';
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

  folders: FolderNiveles[] = [
    {
      name: 'BALDA',
      expanded: true,
      cajas: 12,
      carpetas: 600,
      folios: 5000,
      bodega: 'Bodega Central',
      consecutivoBodega: 'BC-2024-001',
      correlativoDependencia: 'DEP-045',
      cantidadSeries: 8,
      cantidadProcesos: 24,
      anios: '2018 - 2024',
      children: [
        {
          name: 'CJ-001',
          cajas: 3, carpetas: 150, folios: 1200,
          bodega: 'Bodega Central', consecutivoBodega: 'BC-2024-001',
          correlativoDependencia: 'DEP-045', cantidadSeries: 2, cantidadProcesos: 6, anios: '2018 - 2020',
          children: [
            { name: 'Carpeta 1', numeroCarpeta: 'CAR-001', nombreExpediente: 'Expediente Administrativo 2018', fechasExtremas: '2018-01-01 / 2018-12-31', folioPorCarpeta: 200, serie: 'Gestión Administrativa', subseries: ['Contratos', 'Resoluciones'], children: [] },
            { name: 'Carpeta 2', numeroCarpeta: 'CAR-002', nombreExpediente: 'Expediente Financiero 2018', fechasExtremas: '2018-03-01 / 2018-09-30', folioPorCarpeta: 180, serie: 'Gestión Financiera', subseries: ['Presupuesto'], children: [] },
            { name: 'Carpeta 3', numeroCarpeta: 'CAR-003', nombreExpediente: 'Expediente Jurídico 2019', fechasExtremas: '2019-01-15 / 2019-11-30', folioPorCarpeta: 220, serie: 'Gestión Jurídica', subseries: ['Demandas', 'Tutelas', 'Derechos de Petición'], children: [] },
            { name: 'Carpeta 4', numeroCarpeta: 'CAR-004', nombreExpediente: 'Expediente Técnico 2019', fechasExtremas: '2019-02-01 / 2019-12-31', folioPorCarpeta: 160, serie: 'Gestión Técnica', subseries: ['Informes'], children: [] }
          ]
        },
        {
          name: 'CJ-002',
          cajas: 3, carpetas: 150, folios: 1300,
          bodega: 'Bodega Central', consecutivoBodega: 'BC-2024-002',
          correlativoDependencia: 'DEP-046', cantidadSeries: 2, cantidadProcesos: 7, anios: '2019 - 2021',
          children: [
            { name: 'Carpeta 1', numeroCarpeta: 'CAR-005', nombreExpediente: 'Expediente RRHH 2019', fechasExtremas: '2019-01-01 / 2019-12-31', folioPorCarpeta: 210, serie: 'Gestión Humana', subseries: ['Nómina', 'Vacaciones'], children: [] },
            { name: 'Carpeta 2', numeroCarpeta: 'CAR-006', nombreExpediente: 'Expediente Contratación 2020', fechasExtremas: '2020-01-01 / 2020-06-30', folioPorCarpeta: 195, serie: 'Contratación', subseries: ['Licitaciones'], children: [] },
            { name: 'Carpeta 3', numeroCarpeta: 'CAR-007', nombreExpediente: 'Expediente Disciplinario 2020', fechasExtremas: '2020-03-01 / 2020-12-31', folioPorCarpeta: 175, serie: 'Gestión Disciplinaria', subseries: ['Procesos Sancionatorios'], children: [] },
            { name: 'Carpeta 4', numeroCarpeta: 'CAR-008', nombreExpediente: 'Expediente Planeación 2021', fechasExtremas: '2021-01-01 / 2021-12-31', folioPorCarpeta: 230, serie: 'Planeación', subseries: ['POA', 'Seguimiento'], children: [] }
          ]
        },
        {
          name: 'CJ-003',
          cajas: 3, carpetas: 150, folios: 1250,
          bodega: 'Bodega Central', consecutivoBodega: 'BC-2024-003',
          correlativoDependencia: 'DEP-047', cantidadSeries: 2, cantidadProcesos: 5, anios: '2020 - 2022',
          children: [
            { name: 'Carpeta 1', numeroCarpeta: 'CAR-009', nombreExpediente: 'Expediente Ambiental 2020', fechasExtremas: '2020-02-01 / 2020-11-30', folioPorCarpeta: 190, serie: 'Gestión Ambiental', subseries: ['Permisos'], children: [] },
            { name: 'Carpeta 2', numeroCarpeta: 'CAR-010', nombreExpediente: 'Expediente Obras 2021', fechasExtremas: '2021-01-01 / 2021-08-31', folioPorCarpeta: 205, serie: 'Infraestructura', subseries: ['Mantenimiento', 'Construcción'], children: [] },
            { name: 'Carpeta 3', numeroCarpeta: 'CAR-011', nombreExpediente: 'Expediente Sistemas 2021', fechasExtremas: '2021-04-01 / 2021-12-31', folioPorCarpeta: 170, serie: 'TI', subseries: ['Soporte'], children: [] },
            { name: 'Carpeta 4', numeroCarpeta: 'CAR-012', nombreExpediente: 'Expediente Comunicaciones 2022', fechasExtremas: '2022-01-01 / 2022-12-31', folioPorCarpeta: 215, serie: 'Comunicaciones', subseries: ['Correspondencia', 'Circulares'], children: [] }
          ]
        },
        {
          name: 'CJ-004',
          cajas: 3, carpetas: 150, folios: 1250,
          bodega: 'Bodega Central', consecutivoBodega: 'BC-2024-004',
          correlativoDependencia: 'DEP-048', cantidadSeries: 2, cantidadProcesos: 6, anios: '2021 - 2024',
          children: [
            { name: 'Carpeta 1', numeroCarpeta: 'CAR-013', nombreExpediente: 'Expediente Archivo 2021', fechasExtremas: '2021-01-01 / 2021-12-31', folioPorCarpeta: 185, serie: 'Gestión Documental', subseries: ['TRD', 'TVD'], children: [] },
            { name: 'Carpeta 2', numeroCarpeta: 'CAR-014', nombreExpediente: 'Expediente Capacitación 2022', fechasExtremas: '2022-02-01 / 2022-10-31', folioPorCarpeta: 200, serie: 'Capacitación', subseries: ['Formación Interna'], children: [] },
            { name: 'Carpeta 3', numeroCarpeta: 'CAR-015', nombreExpediente: 'Expediente Proyectos 2023', fechasExtremas: '2023-01-01 / 2023-12-31', folioPorCarpeta: 225, serie: 'Proyectos', subseries: ['Formulación', 'Ejecución'], children: [] },
            { name: 'Carpeta 4', numeroCarpeta: 'CAR-016', nombreExpediente: 'Expediente General 2024', fechasExtremas: '2024-01-01 / 2024-06-30', folioPorCarpeta: 140, serie: 'General', subseries: ['Varios'], children: [] }
          ]
        }
      ]
    }
  ];


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

    constructor(private httpUnidades: UnidadesService, private sweet: SweetAlertService,private httpLogin: LoginService ){
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

    abrirModalRegistroArchivo(idDetalle: number | null):void{
        const modalArchivo = document.getElementById('modalRegistroArchivoUnidadActiva');
        this.bootstrapModalRegistroArchivo = new bootstrap.Modal(modalArchivo);
        this.idDetalle = idDetalle;
        this.unidadArchivo = idDetalle ?? 0;
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
          }
        });
       /*  this.getAllUnidades(this.pagina, idPadre);
        this.getIdDependenciaSeleccionada(idPadre);


         */
        // Aquí podrías llamar a filtrarUnidades() si quieres filtrar automáticamente
    }



}
