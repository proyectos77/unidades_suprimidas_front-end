import { Component, OnInit } from '@angular/core';
import { DatumUsuario, GetAllUsuarios } from '../../interfaces/get-all-usuarios';
import { UsuariosServicesService } from '../../services/usuarios-services.service';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GetAllTiposUsuarios } from '../../interfaces/get-all-tipos-usuarios';
import { ModalEditarUsuarioComponent } from "../../components/modal-editar-usuario/modal-editar-usuario.component";
import { log } from 'console';

declare var bootstrap: any;

@Component({
  selector: 'app-liestado-usuarios',
  imports: [CommonModule, NgFor, RouterLink, ModalEditarUsuarioComponent],
  templateUrl: './listado-usuarios.component.html',
  styleUrl: './listado-usuarios.component.css'
})
export default class LiestadoUsuariosComponent implements OnInit{


    public datos: GetAllUsuarios = {
        "statusCode": 0,
        "titulo": '',
        "mensaje": '',
        "icono": '',
        "data": [],
        "infoPagination": {
            'pagina': 0,
            'totalRegistro': 0,
            'totalRegistrosPorPagina': 0,
            'totalPaginas': 0
        }
    }

    public tipoUsuario: GetAllTiposUsuarios = {
        'statusCode': 0,
        'titulo': '',
        'mensaje': '',
        'icono': '',
        'data': []
    }

    public bootstrapModal: any;
    public usuario: DatumUsuario = {
        'id' : 0,
        'nombre': '',
        'identificacion': 0,
        'usuario': '',
        'email': '',
        'tipoUsuario': 0,
        'cargo': 0,
        'estado': ''
    }

    public pagina:number = 1;
    public totalRegistros:number = 0;
    public registrosPorPagina:number = 0;
    public totalPaginas:number = 0;
    public abrirModal: boolean = false;

    constructor(private httpUsuarios: UsuariosServicesService){}

    ngOnInit(): void {
        this.listadoUsuarios(1);
    }

    listadoUsuarios(pagina: number ):void{
        this.httpUsuarios.consultaListaUsuarios(pagina).subscribe(usuarios => {
            if (usuarios.statusCode == 200) {
                console.log(usuarios.infoPagination.pagina);

                this.datos = usuarios;
            }
        })
    }

    openModal(usuario : DatumUsuario):void{

        const modal = document.getElementById('modalUsuario');
        this.bootstrapModal = new bootstrap.Modal(modal);

        this.usuario = usuario;
        this.bootstrapModal.show();
    }

    cambiarPagina(pagina: number):void{
        if (pagina >= 1 && pagina <= this.datos.infoPagination.totalPaginas) {
            this.listadoUsuarios(pagina);
        }
    }
}
