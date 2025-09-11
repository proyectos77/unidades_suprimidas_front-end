import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../Auth/services/login.service';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { GetNotificaciones } from '../interfaces/get-notificaciones';
import { NotificacionesService } from '../services/notificaciones.service';

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
    public notificaciones: GetNotificaciones ={
        statusCode: 0,
        titulo: '',
        mensaje: '',
        icono: '',
        data: {
            total_hoy: 0,
            total_semana: 0,
            total_mes: 0
        }
    }

    intervalId: any;

    constructor(private httpAuth: LoginService, private router: Router, private notifiaciones: NotificacionesService){
        this.mostrarMenuSuperUsuario = this.httpAuth.tienePermiso([1]);
    }

    ngOnInit(): void {
        this.usuario();
        console.log(this.mostrarMenuSuperUsuario);

            if (this.mostrarMenuSuperUsuario) {
                this.getNotificaiones();
                this.intervalId = setInterval(() => {
                    this.getNotificaiones();
                }, 60000); // 60000 ms = 1 minuto
            }

    }

    cerrarSesion():void{
        this.httpAuth.cerrarSesion().subscribe(cierre =>{});
    }

    usuario():void{

        let datoUsuario = this.httpAuth.datosSesion();


        this.nombreUsuario = datoUsuario.nombre;
        this.rol = datoUsuario.rol;
    }

    getNotificaiones():void{
        this.notifiaciones.getNotificaciones().subscribe(notificaciones =>{
            this.notificaciones = notificaciones;
        });
    }

    ngOnDestroy(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}
