import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import ModalVisualizacionComponent from '../../components/modal-visualizacion/modal-visualizacion.component';
import { Modal } from 'bootstrap';
import { LoginService } from '../../../../Auth/services/login.service';
import ModalCargarDocumentacionComponent from '../../components/modal-cargar-documentacion/modal-cargar-documentacion.component';
import { ManualesInformacionServiceService } from '../../services/manuales-informacion-service.service';
import { SweetAlertService } from '../../../../Core/services/sweet-alert.service';
import { GetAllDocumentacionSistema } from '../../interfaces/get-all-documentacion-sistema';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-vista-manuales',
  imports: [NgIf, ModalVisualizacionComponent, ModalCargarDocumentacionComponent, NgFor, FormsModule],
  templateUrl: './vista-manuales.component.html',
  styleUrl: './vista-manuales.component.css'
})
export default class VistaManualesComponent {

    filtro = 'todos';
    public bootstrapModal: any;
    public tipoContenido: string = '';
    public urlContenido: string = '';
    public modalAbierto: boolean = false;
    public rolUser: number = 0;
    public modalCargarDocumentacionAbierto: boolean = false;
    public documentacionSistema: GetAllDocumentacionSistema ={
        statusCode: 0,
        titulo: '',
        mensaje: '',
        icono: '',
        data: [],
        infoPagination: {
            pagina: 0,
            totalRegistro: 0,
            totalRegistrosPorPagina: 0,
            totalPaginas: 0
        }
    }

    constructor(private httpLogin: LoginService, private manualesInformacionService: ManualesInformacionServiceService, private sweet: SweetAlertService) {
        const sesion = this.httpLogin.datosSesion();
        this.rolUser = sesion?.idTipoUsuario || 0;

    }

    regresar(): void {

    }

    dataFilter(filter: string): void {
        this.filtro = filter;
    }

    abrirModal(tipoContenido: string, urlContenido: string): void {
        this.tipoContenido = tipoContenido;
        this.urlContenido = urlContenido;
        this.modalAbierto = true;
        setTimeout(() => {
            const modal = document.getElementById('modalVisualizacion');

            if (modal) {
                this.bootstrapModal = new bootstrap.Modal(modal, {
                    backdrop: 'static'
                });

                this.bootstrapModal.show();
            }
        });
    }

    abrirModalDocumentacion():void{
        this.modalCargarDocumentacionAbierto = true;
        setTimeout(() => {
            const modal = document.getElementById('modalCargarDocumentacion');
            if (modal) {
                this.bootstrapModal = new bootstrap.Modal(modal, {
                    backdrop: 'static'
                });

                this.bootstrapModal.show();
            }
        });
    }

    cargarDocumentacion(): void {
        this.manualesInformacionService.getAllDocumentacionSistema().subscribe({
            next: (response) => {
                this.documentacionSistema = response;
            },
            error: (error) => {
                this.sweet.alertaGeneral('error', 'Error', 'Error al registrar la documentación');
            }
        });
    }



}



