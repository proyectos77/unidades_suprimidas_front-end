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

    alertaDeConfirmacionAprobacion():Promise<any>{
        return Swal.fire({
          title: 'Aprobar solicitud?',
          text: 'Esta seguro de aprobar la solicitud!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aprobar',
          cancelButtonText: 'Cancelar',
        });
    }


    async alertaConTexArea(titulo: string, texto: string): Promise<any> {
        return await Swal.fire({
            title: titulo,
            text: texto,
            input: 'textarea',
            inputAttributes: {
              autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Enviar',
            cancelButtonText: 'Cancelar',
            showLoaderOnConfirm: true,
            preConfirm: async (inputValue) => {
                if (!inputValue) {
                    Swal.showValidationMessage('Debes ingresar una observación');
                    return false;
                }
                return inputValue;
            },
            allowOutsideClick: () => !Swal.isLoading()
        });
    }





}
