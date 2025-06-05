import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../Auth/services/login.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export default class HeaderComponent implements OnInit {

    public nombreUsuario: string = '';
    public rol: string = '';
    constructor(private httpAuth: LoginService, private router: Router){}

    ngOnInit(): void {
        this.usuario();
    }

    cerrarSesion():void{
        this.httpAuth.cerrarSesion().subscribe(cierre =>{});
    }

    usuario():void{

        let datoUsuario = this.httpAuth.datosSesion();
        console.log(datoUsuario);

        this.nombreUsuario = datoUsuario.nombre;
        this.rol = datoUsuario.rol;
    }
}
