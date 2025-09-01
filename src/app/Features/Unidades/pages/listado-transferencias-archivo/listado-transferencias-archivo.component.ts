import { Component, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, Location, NgFor } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TransferenciasService } from '../../../../Core/services/transferencias.service';
import { ListadoTransferenciasPorArchivo } from '../../../../Core/interfaces/listado-transferencias-por-archivo';
import { BuscadorTransferenciaPorArchivoPipe } from '../../../../Shared/Pipes/buscador-transferencia-por-archivo.pipe';


@Component({
  selector: 'app-listado-transferencias-archivo',
  imports: [
      FormsModule,
      CommonModule,
      NgxChartsModule,
      BuscadorTransferenciaPorArchivoPipe,
  ],
  templateUrl: './listado-transferencias-archivo.component.html',
  styleUrl: './listado-transferencias-archivo.component.css'
})
export default class ListadoTransferenciasArchivoComponent implements OnInit{

    public pagina:number = 1;
    public totalRegistros:number = 0;
    public registrosPorPagina:number = 0;
    public totalPaginas:number = 0;
    /* public unidad!: DatumUnidad; */
    public filterPost: string = '';

    public transferencias: ListadoTransferenciasPorArchivo = {
        statusCode:     0,
        titulo:         '',
        mensaje:        '',
        icono:          '',
        data:           [],
        infoPagination: {
            pagina:                  0,
            totalRegistro:           0,
            totalRegistrosPorPagina: 0,
            totalPaginas:            0
        }
    }


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private httpTransferencias: TransferenciasService,
        private location: Location
    ) {}


    ngOnInit(): void {
        /* let idArchivo = this.route.snapshot.paramMap.get('id'); */
        /* console.log(idArchivo); */
        this.listadoTransferencias(this.pagina);

    }

    listadoTransferencias(pagina: number):void {
        let parametro = this.route.snapshot.paramMap.get('id');
        let id = (parametro !== null) ? parseInt(parametro) : 0;

        this.httpTransferencias.getAllTransferenciasPorArchivo(id, pagina).subscribe(transferencias => {
            console.log(transferencias);

            this.transferencias = transferencias;

        });


    }

    regresar():void{
        this.location.back();

    }

    cambiarPagina(pagina: number):void{
        if (pagina >= 1 && pagina <= this.transferencias.infoPagination.totalPaginas) {
            this.listadoTransferencias(pagina);
        }
    }

}
