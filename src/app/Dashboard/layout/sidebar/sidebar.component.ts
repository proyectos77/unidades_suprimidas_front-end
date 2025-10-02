import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { LoginService } from '../../../Auth/services/login.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, RouterLink, NgIf],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export default class SidebarComponent implements OnInit {

    public rolUser: string = '';

    constructor(private httpLogin: LoginService){

    }

    ngOnInit(): void {
        this.rolUser = this.httpLogin.datosSesion().idTipoUsuario;
    }

}
