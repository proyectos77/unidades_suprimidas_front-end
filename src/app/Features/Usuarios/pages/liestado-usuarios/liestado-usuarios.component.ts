import { Component, OnInit } from '@angular/core';
import { DatumUsuario, GetAllUsuarios } from '../../interfaces/get-all-usuarios';
import { UsuariosServicesService } from '../../services/usuarios-services.service';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GetAllTiposUsuarios } from '../../interfaces/get-all-tipos-usuarios';
import { ModalEditarUsuarioComponent } from "../../components/modal-editar-usuario/modal-editar-usuario.component";

declare var bootstrap: any;

@Component({
  selector: 'app-liestado-usuarios',
  imports: [CommonModule, NgFor, RouterLink, ModalEditarUsuarioComponent],
  templateUrl: './liestado-usuarios.component.html',
  styleUrl: './liestado-usuarios.component.css'
})
export default class LiestadoUsuariosComponent implements OnInit{


    public datos: GetAllUsuarios = {
        "statusCode": 0,
        "titulo": '',
        "mensaje": '',
        "icono": '',
        "data": []
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
        'tipoUsuario': '',
        'cargo': '',
        'estado': ''
    }

    constructor(private httpUsuarios: UsuariosServicesService){}

    ngOnInit(): void {
        this.listadoUsuarios();
    }

    listadoUsuarios():void{
        this.httpUsuarios.consultaListaUsuarios().subscribe(usuarios => {
            if (usuarios.statusCode == 200) {
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


}
