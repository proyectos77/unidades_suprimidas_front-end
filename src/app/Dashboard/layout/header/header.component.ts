import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

import { LoginService } from '../../../Auth/services/login.service';
import { GetNotificaciones } from '../interfaces/get-notificaciones';
import { NotificacionesService } from '../services/notificaciones.service';

@Component({
  selector: 'app-header',
  standalone: true, // 🔹 esto faltaba
  imports: [RouterLink, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export default class HeaderComponent implements OnInit, OnDestroy {

  public nombreUsuario: string = '';
  public rol: string = '';
  public mostrarMenuSuperUsuario: boolean = false;

  public notificaciones: GetNotificaciones = {
    statusCode: 0,
    titulo: '',
    mensaje: '',
    icono: '',
    data: {
      total_hoy: 0,
      total_semana: 0,
      total_mes: 0
    }
  };

  private intervalId: any;

  constructor(
    private httpAuth: LoginService,
    private router: Router,
    private notificacionesService: NotificacionesService
  ) {
    this.mostrarMenuSuperUsuario = this.httpAuth.tienePermiso([1]);
  }

  ngOnInit(): void {
    this.usuario();

    if (this.mostrarMenuSuperUsuario) {
      this.getNotificaciones();
      this.intervalId = setInterval(() => {
        this.getNotificaciones();
      }, 666000); // ~11 minutos
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  cerrarSesion(): void {
    this.httpAuth.cerrarSesion().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  usuario(): void {
    const datoUsuario = this.httpAuth.datosSesion();
    this.nombreUsuario = datoUsuario.nombre;
    this.rol = datoUsuario.rol;
  }

  getNotificaciones(): void {
    this.notificacionesService.getNotificaciones().subscribe((notificaciones) => {
      this.notificaciones = notificaciones;
    });
  }
}
