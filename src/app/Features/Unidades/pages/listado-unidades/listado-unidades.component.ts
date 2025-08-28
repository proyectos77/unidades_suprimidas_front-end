import { Component, OnInit } from '@angular/core';
import { DependenciaServiceService } from '../../../Usuarios/services/dependencia-service.service';
import { DatumUnidad, GetAllUnidades } from '../../interfaces/get-all-unidades';
import { UnidadesService } from '../../services/unidades.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ModalEditarUnidadComponent } from "../../components/modal-editar-unidad/modal-editar-unidad.component";
import { SweetAlertService } from '../../../../Core/services/sweet-alert.service';
import { RouterLink, RouterModule } from '@angular/router';
import { BuscadorListadoUnidadesPipe } from '../../../../Shared/Pipes/buscador-listado-unidades.pipe';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../../../Auth/services/login.service';


declare var bootstrap: any;
@Component({
  selector: 'app-listado-unidades',
  imports: [RouterModule, RouterLink, NgFor, NgIf, NgClass, ModalEditarUnidadComponent, BuscadorListadoUnidadesPipe, FormsModule],
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
        /* this.getIdDependenciaSeleccionada(idPadre); */

        this.nivelesDependencias[nivelIndex].seleccion = idPadre;
        this.nivelesDependencias = this.nivelesDependencias.slice(0, nivelIndex + 1);
        this.dependenciaService.getListadoUnidadesHijas(idPadre).subscribe(hijos => {
            if (hijos.data && hijos.data.length > 0) {
                this.nivelesDependencias.push({ opciones: hijos.data, seleccion: null });
            }
        });
        // Aquí podrías llamar a filtrarUnidades() si quieres filtrar automáticamente
    }

    getAllUnidades(pagina: number, idDependencia: number = 0):void{
        this.httUnidades.getAllUnidades(pagina, idDependencia).subscribe(unidades =>{
            if (unidades.data.length == 0) {
              this.pagina = 0
            }else{
                this.listaUnidades = unidades
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

    limpiarFiltros(): void {
        this.filterPost = '';
        this.nivelesDependencias = this.nivelesDependencias.map(nivel => ({ ...nivel, seleccion: null }));
        this.nivelesDependencias = [];
        this.listadoDependenciasPadre();
        this.getAllUnidades(1);
    }

}
