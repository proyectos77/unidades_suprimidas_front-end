import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { LoginService } from '../../../Auth/services/login.service';
import { NgIf } from '@angular/common';
import { log } from 'console';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, RouterLink, NgIf],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export default class SidebarComponent implements OnInit {

    public rolUser: string = '';
    public Permiso: number = 0;

    constructor(private httpLogin: LoginService){

    }

    ngOnInit(): void {
        this.rolUser = this.httpLogin.datosSesion().idTipoUsuario;
        this.Permiso = this.httpLogin.datosSesion().id_permiso;

        console.log('Permiso: ' + this.Permiso);

    }

}
