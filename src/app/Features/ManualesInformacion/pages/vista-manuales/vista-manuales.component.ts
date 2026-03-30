import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import ModalVisualizacionComponent from '../../components/modal-visualizacion/modal-visualizacion.component';
import { Modal } from 'bootstrap';

declare var bootstrap: any;

@Component({
  selector: 'app-vista-manuales',
  imports: [NgIf, ModalVisualizacionComponent],
  templateUrl: './vista-manuales.component.html',
  styleUrl: './vista-manuales.component.css'
})
export default class VistaManualesComponent {

    filtro = 'todos';
    public bootstrapModal: any;
    public tipoContenido: string = '';
    public urlContenido: string = '';
    public modalAbierto: boolean = false;

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

}



