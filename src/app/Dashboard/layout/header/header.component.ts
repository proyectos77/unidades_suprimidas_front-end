import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../Auth/services/login.service';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export default class HeaderComponent implements OnInit {

    public nombreUsuario: string = '';
    public rol: string = '';
    public mostrarMenuSuperUsuario: boolean = false;
    constructor(private httpAuth: LoginService, private router: Router){
        this.mostrarMenuSuperUsuario = this.httpAuth.tienePermiso([1]);
    }

    ngOnInit(): void {
        this.usuario();

    }

    cerrarSesion():void{
        this.httpAuth.cerrarSesion().subscribe(cierre =>{});
    }

    usuario():void{

        let datoUsuario = this.httpAuth.datosSesion();


        this.nombreUsuario = datoUsuario.nombre;
        this.rol = datoUsuario.rol;
    }
}
