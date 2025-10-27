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
declare var bootstrap: any;
@Component({
  selector: 'app-listado-unidades-activas',
  imports: [RouterModule, RouterLink, NgFor, NgIf, NgClass, ModalEditarUnidadComponent, BuscadorListadoUnidadesActivasPipe, FormsModule],
  templateUrl: './listado-unidades-activas.component.html',
  styleUrl: './listado-unidades-activas.component.css'
})
 export default class ListadoUnidadesActivasComponent implements OnInit {

    public bootstrapModal: any;
    public pagina:number = 1;
    public totalRegistros:number = 0;
    public registrosPorPagina:number = 0;
    public totalPaginas:number = 0;
    public unidad!: DatumUnidad;
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

    public nivelesDependencias: Array<{ opciones: any[]; seleccion: any }> = [];
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
   }

   getLListadoUnidadesActivas(pagina: number = 1):void{
        this.httpUnidades.listadoUnidadesActivas(pagina, this.filterPost).subscribe( (unidades) => {
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
        this.getLListadoUnidadesActivas();
       /*  this.nivelesDependencias = this.nivelesDependencias.map(nivel => ({ ...nivel, seleccion: null }));
        this.nivelesDependencias = [];
        this.listadoDependenciasPadre();
        this.getAllUnidades(1); */
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

}
