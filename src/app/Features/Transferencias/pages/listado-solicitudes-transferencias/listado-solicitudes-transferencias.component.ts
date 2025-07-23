import { Component, OnInit } from '@angular/core';
import { ListadoSolicitudesTransferencias } from '../../interfaces/listado-solicitudes-transferencias';
import { TransferenciasService } from '../../services/transferencias.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BuscadorListadoSolicitudesPipe } from '../../../../Shared/Pipes/buscador-listado-solicitudes.pipe';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../../../Auth/services/login.service';

@Component({
  selector: 'app-listado-solicitudes-transferencias',
  imports: [NgFor, NgIf, FormsModule, BuscadorListadoSolicitudesPipe, CommonModule, RouterLink],
  templateUrl: './listado-solicitudes-transferencias.component.html',
  styleUrl: './listado-solicitudes-transferencias.component.css'
})
export default class ListadoSolicitudesTransferenciasComponent implements OnInit{
    public solicitud: ListadoSolicitudesTransferencias = {
        statusCode: 0,
        titulo:     '',
        mensaje:    '',
        icono:      '',
        data:       [],
        infoPagination: {
            pagina: 0,
            totalRegistro: 0,
            totalRegistrosPorPagina: 0,
            totalPaginas: 0
        }
    }

    public pagina:number = 1;
    public totalRegistros:number = 0;
    public registrosPorPagina:number = 0;
    public totalPaginas:number = 0;
    public filterPost:string = '';
    public usuarioLogueado:number = 0;
    private perfilUsuarioLogueado:number = 0;


    constructor(private httpTransferencias: TransferenciasService, private httpLogin: LoginService){
        this.usuarioLogueado = this.httpLogin.datosSesion().id
        this.perfilUsuarioLogueado = this.httpLogin.datosSesion().idTipoUsuario;
    }

    ngOnInit(): void {

        this.listadoSolicitudes(this.usuarioLogueado, this.perfilUsuarioLogueado, 1);
    }

    listadoSolicitudes(usuario: number, perfil: number, pagina:number):void{
        this.httpTransferencias.getAllSolicitudesTransferencias(usuario, perfil, pagina).subscribe(solicitudes =>{
            this.solicitud = solicitudes;

        });
    }


    cambiarPagina(pagina: number):void{
        if (pagina >= 1 && pagina <= this.solicitud.infoPagination.totalPaginas) {
            this.listadoSolicitudes(this.usuarioLogueado, this.perfilUsuarioLogueado, pagina);
        }
    }

}
