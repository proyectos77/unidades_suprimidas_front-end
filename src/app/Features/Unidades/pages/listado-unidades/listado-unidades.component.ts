import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GetAllUnidades } from '../../interfaces/get-all-unidades';
import { UnidadesService } from '../../services/unidades.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-listado-unidades',
  imports: [RouterLink, NgFor, NgIf],
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

    public pagina:number = 1;
    public totalRegistros:number = 0;
    public registrosPorPagina:number = 0;
    public totalPaginas:number = 0;

    constructor(private httUnidades: UnidadesService){}

    ngOnInit(): void {
        this.getAllUnidades(this.pagina);
    }

    getAllUnidades(pagina: number):void{
        this.httUnidades.getAllUnidades(pagina).subscribe(unidades =>{
            this.listaUnidades = unidades
        });
    }

    cambiarPagina(pagina: number):void{
        if (pagina >= 1 && pagina <= this.listaUnidades.infoPagination.totalPaginas) {
            this.getAllUnidades(pagina);
        }
    }
}
