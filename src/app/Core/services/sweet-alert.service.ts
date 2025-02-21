import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'
@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

    constructor() {}

    alertaGeneral(icono: string, titulo: string, mensaje: string){
      Swal.fire({
          icon:   icono as 'success' | 'error' | 'warning' | 'info' | 'question',
          title:  titulo,
          text:   mensaje
      });
    }

    alertaLogin(title: string){
        Swal.fire({
            title: title,
            icon: "success",
            draggable: true
        });
    }

    alertaLogin2(){
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Bienvenido",
            showConfirmButton: false,
            timer: 1500
        });
    }
}
