import { Component, OnInit } from '@angular/core';
import { DatumUnidad, GetAllUnidades } from '../../interfaces/get-all-unidades';
import { UnidadesService } from '../../services/unidades.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ModalEditarUnidadComponent } from "../../components/modal-editar-unidad/modal-editar-unidad.component";
import { SweetAlertService } from '../../../../Core/services/sweet-alert.service';
import { RouterLink, RouterModule } from '@angular/router';
import { BuscadorListadoUnidadesPipe } from '../../../../Shared/Pipes/buscador-listado-unidades.pipe';
import { FormsModule } from '@angular/forms';


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


    constructor(private httUnidades: UnidadesService, private sweet: SweetAlertService){}

    ngOnInit(): void {
        this.getAllUnidades(this.pagina);
    }

    getAllUnidades(pagina: number):void{
        this.httUnidades.getAllUnidades(pagina).subscribe(unidades =>{
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

}
