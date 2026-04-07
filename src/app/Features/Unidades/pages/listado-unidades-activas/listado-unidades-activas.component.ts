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
import RegistroArchivoUnidadActivaComponent from '../../components/registro-archivo-unidad-activa/registro-archivo-unidad-activa.component';
import { RegistroAnioArchivoUnidadActivaComponent } from "../../components/registro-anio-archivo-unidad-activa/registro-anio-archivo-unidad-activa.component";
import { log } from 'console';
import { ArchivoUnidadActivaComponent } from '../../components/archivo-unidad-activa/archivo-unidad-activa.component';
import { FolderNiveles } from '../../interfaces/FolderNiveles';

declare var bootstrap: any;
declare var bootstrapArchivo: any;

@Component({
  selector: 'app-listado-unidades-activas',
  imports: [RouterModule, RouterLink, NgFor, NgIf, NgClass, ModalEditarUnidadComponent, BuscadorListadoUnidadesActivasPipe, FormsModule, RegistroArchivoUnidadActivaComponent, RegistroAnioArchivoUnidadActivaComponent, ArchivoUnidadActivaComponent],
  templateUrl: './listado-unidades-activas.component.html',
  styleUrl: './listado-unidades-activas.component.css'
})
 export default class ListadoUnidadesActivasComponent implements OnInit {

  public mostrarDesglose: boolean = false;

  folders: FolderNiveles[] = [
    {
      name: 'PRINCIPAL',
      expanded: true,
      children: [
        {
          name: 'SEGUNDO NIVEL 1',
          children: [
            { name: 'TERCER NIVEL 1', children: [] }
          ]
        },
        {
          name: 'SEGUNDO NIVEL 2',
          children: [
            { name: 'TERCER NIVEL 2', children: [] },
            { name: 'TERCER NIVEL 3', children: [] }
          ]
        },
        {
          name: 'SEGUNDO NIVEL 3',
          children: [
            { name: 'TERCER NIVEL 4', children: [] },
            { name: 'TERCER NIVEL 5', children: [] },
            { name: 'TERCER NIVEL 6', children: [] }
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
                console.log("entro para mostrar el desglose");
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

    abrirModalRegistroArchivo(unidadArchivo: DatumUnidad):void{
        const modalArchivo = document.getElementById('modalRegistroArchivoUnidadActiva');
        this.bootstrapModalRegistroArchivo = new bootstrap.Modal(modalArchivo);
        this.unidadArchivo = unidadArchivo.id_unidad;
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
