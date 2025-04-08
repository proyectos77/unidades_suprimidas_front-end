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

    alertaCamposInvalidosFormularios(){
        Swal.fire({
            icon: "warning",
            title: "Error de campos",
            text:   'Favor diligenciar todos los campos del formulario'
        });
    }

    alertaDeConfirmacionRegistro():Promise<any>{
        return Swal.fire({
          title: 'Desea realizar el registro?',
          text: 'Esta seguro de realizar el registro!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si registrar',
          cancelButtonText: 'Cancelar',
        });
    }
}
