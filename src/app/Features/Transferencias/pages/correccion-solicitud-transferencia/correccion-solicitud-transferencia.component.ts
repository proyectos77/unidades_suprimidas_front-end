import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetalleTransferenciasService } from '../../services/detalle-transferencias.service';
import { ListadoDetalleSolicitud, Datum } from '../../interfaces/listado-detalle-solicitud';
import { SweetAlertService } from '../../../../Core/services/sweet-alert.service';
import { ListadoDocumentosDetalle } from '../../interfaces/listado-documentos-detalle';
import { UrlDocumentosPipe } from '../../../../Shared/Pipes/url-documentos.pipe';

@Component({
  selector: 'app-correccion-solicitud-transferencia',
  imports: [NgIf, NgFor, FormsModule, RouterLink, UrlDocumentosPipe],
  templateUrl: './correccion-solicitud-transferencia.component.html',
  styleUrl: './correccion-solicitud-transferencia.component.css'
})
export default class CorreccionSolicitudTransferenciaComponent implements OnInit {

    private idSolicitudTransferencia: number = 0;
    public editingItemId: number | null = null;
    public editingItem: Datum | null = null;

    public detalle: ListadoDetalleSolicitud = {
        statusCode: 0,
        titulo:     '',
        mensaje:    '',
        icono:      '',
        data:       []
    }

    public documentos: ListadoDocumentosDetalle = {
        statusCode: 0,
        titulo:     '',
        mensaje:    '',
        icono:      '',
        data:       []
    }

    public nombreDocumentoModal: string = '';
    public urlDocumentoModal: string = '';
    public idTransferencia: number = 0;

    constructor(private router: ActivatedRoute, private httpDetalleTransferencia: DetalleTransferenciasService, private sweet: SweetAlertService) {
        this.idSolicitudTransferencia = parseInt(this.router.snapshot.paramMap.get('idTransferencia') || '0');
    }


    ngOnInit(): void {
        console.log(this.idSolicitudTransferencia);
        this.consultaDetalleTransferencia(this.idSolicitudTransferencia);
    }

    consultaDetalleTransferencia(idSolicitudTransferencia: number){
        this.httpDetalleTransferencia.listadoDetalleTransferencia(idSolicitudTransferencia).subscribe(detalle => {
            this.detalle = detalle
            this.idTransferencia = detalle.data[0].id_transferencia;
            this.listadoDocumentos();
        });
    }

    // Método para iniciar la edición de un item
    editarItem(item: Datum): void {
        this.editingItemId = item.id_detalle_transferencia;
        // Crear una copia del item para editar
        this.editingItem = { ...item };
    }

    // Método para confirmar los cambios
    confirmarEdicion(): void {
        if (this.editingItem && this.editingItemId) {
            // Buscar el índice del item en el array
            const index = this.detalle.data.findIndex(item => item.id_detalle_transferencia === this.editingItemId);

            if (index !== -1) {
                // Actualizar el item en el array con los nuevos valores
                this.detalle.data[index] = { ...this.editingItem };

                this.httpDetalleTransferencia.setUpdateDetalleTransferencia(this.editingItemId, {
                    seccion:  this.editingItem.seccion_detalle_transferencia,
                    serie:    this.editingItem.serie_detalle_transferencia,
                    subserie: this.editingItem.subserie_detalle_transferencia,
                    cajas:    this.editingItem.cantidad_cajas_detalle_transferencia,
                    carpetas: this.editingItem.cantidad_carpetas_detalle_transferencia,
                    otros:    this.editingItem.cantidad_otros_detalle_transferencia,
                    folios:   this.editingItem.cantidad_folios_detalle_transferencia
                }).subscribe(response => {
                    console.log('Datos actualizados:', response);
                });
            }
        }

        // Limpiar el estado de edición
        this.cancelarEdicion();
    }

    // Método para cancelar la edición
    cancelarEdicion(): void {
        this.editingItemId = null;
        this.editingItem = null;
    }

    eliminarDetalle(id: number): void {

        if (this.detalle.data.length === 1) {
            this.sweet.alertaGeneral('error', 'Error', 'No se puede eliminar el último detalle, si desea eliminarla por favor cancele la solicitud y realícela de nuevo.')
        }else{
                this.httpDetalleTransferencia.deleteDetalleTransferencia(id).subscribe(response => {
                console.log('Detalle eliminado:', response);
                // Actualizar la lista después de eliminar
                this.consultaDetalleTransferencia(this.idSolicitudTransferencia);
            });
        }


    }

    listadoDocumentos(){
      this.httpDetalleTransferencia.listadoDocumentosDetalle(this.idTransferencia).subscribe(documentos => {
          this.documentos = documentos;
    });
    }

    abrirModalDocumento(idDocumento: number): void {
        const modal = document.getElementById('modalVerDocumento');

        console.log('modal:', modal);
        if (modal) {
            modal.classList.add('show');
            modal.style.display = 'block';
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('role', 'dialog');
        }

        this.httpDetalleTransferencia.verDocumento(idDocumento).subscribe(documento => {
            this.nombreDocumentoModal = documento.nombre_documento;
            this.urlDocumentoModal = `http://localhost:8000/storage/${documento.url_documento}`;
        });
    }

    cerrarModalDocumento(): void {
        const modal = document.getElementById('modalVerDocumento');
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
            modal.removeAttribute('aria-modal');
            modal.removeAttribute('role');
        }
        this.nombreDocumentoModal = '';
        this.urlDocumentoModal = '';
    }


}
