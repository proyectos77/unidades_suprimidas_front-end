import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetalleTransferenciasService } from '../../services/detalle-transferencias.service';
import { ListadoDetalleSolicitud, Datum } from '../../interfaces/listado-detalle-solicitud';
import { SweetAlertService } from '../../../../Core/services/sweet-alert.service';
import { ListadoDocumentosDetalle } from '../../interfaces/listado-documentos-detalle';
import { UrlDocumentosPipe } from '../../../../Shared/Pipes/url-documentos.pipe';
import { SeriesSubseriesService } from '../../services/series-subseries.service';
import { ListadoSeries } from '../../interfaces/listado-series';
import { ListadoSubseries } from '../../interfaces/listado-subseries';
import { TransferenciasService } from '../../services/transferencias.service';


@Component({
  selector: 'app-correccion-solicitud-transferencia',
  imports: [NgIf, NgFor, FormsModule, RouterLink, UrlDocumentosPipe],
  templateUrl: './correccion-solicitud-transferencia.component.html',
  styleUrl: './correccion-solicitud-transferencia.component.css'
})
export default class CorreccionSolicitudTransferenciaComponent implements OnInit {

    public  archivoSeleccionado: File | null = null;
    private idTransferenciaEnviado: number = 0;
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
    public idSolicitud: number = 0;

    public series: ListadoSeries = {
        statusCode: 0,
        titulo: '',
        mensaje: '',
        icono: '',
        data: []
    };
    public subseries: ListadoSubseries = {
        statusCode: 0,
        titulo: '',
        mensaje: '',
        icono: '',
        data: []
    };

    constructor(
        private router: ActivatedRoute,
        private httpDetalleTransferencia: DetalleTransferenciasService,
        private sweet: SweetAlertService,
        private seriesSubseriesService: SeriesSubseriesService,
        private httpTransferencia: TransferenciasService,
        private routerRegresa: Router
    ) {
        this.idTransferenciaEnviado = parseInt(this.router.snapshot.paramMap.get('idTransferencia') || '0');
        console.log('id_enviado:', this.idTransferenciaEnviado);
    }


    ngOnInit(): void {
        console.log(this.idTransferenciaEnviado);
        this.consultaDetalleTransferencia(this.idTransferenciaEnviado);
    }

    consultaDetalleTransferencia(idTransferenciaEnviado: number){
        this.httpDetalleTransferencia.listadoDetalleTransferencia(idTransferenciaEnviado).subscribe(detalle => {
          console.log(detalle);

            this.detalle = detalle
            this.idTransferencia = detalle.data[0].id_transferencia;
            this.idSolicitud = detalle.data[0].transferencia.solicitudes[0].id_solicitud_transferencia;
            this.listadoDocumentos();
            // Cargar series del primer detalle si existe
            if (detalle.data.length > 0) {
                const anio = detalle.data[0].transferencia.archivo.anio_registro_archivo;
                if (anio) {
                    this.cargarSeries(anio);
                }
            }
        });
    }

    cargarSeries(anio: string):void {
        console.log('entro');

        this.seriesSubseriesService.getListadoSeries(anio).subscribe(series => {
            this.series = series;
            console.log(series);
        });
    }

    cargarSubseries(idSerie: number):void {
        this.seriesSubseriesService.getListadoSubseries(idSerie).subscribe(subseries => {
            this.subseries = subseries;
        });
    }

    // Método para iniciar la edición de un item
    editarItem(item: Datum): void {
        this.editingItemId = item.id_detalle_transferencia;
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
                    serie:    this.editingItem.serie.id_serie,
                    subserie: this.editingItem.subserie.id_subserie,
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

    // Cuando cambia la serie en el select
    onSerieChange(idSerie: number) {
        this.cargarSubseries(idSerie);
        if (this.editingItem) {
            const serie = this.series.data.find(s => s.id_serie == idSerie);
            if (serie) {
                this.editingItem.serie = { ...serie };
                // Limpiar subserie seleccionada
                this.editingItem.subserie = { id_subserie: 0, codigo_subserie: 0, nombre_subserie: '', id_serie: idSerie, fecha_creacion_subserie: new Date(), fecha_actualizacion_subserie: new Date(), id_estado: 1 };
            }
        }
    }

    // Cuando cambia la subserie en el select
    onSubserieChange(idSubserie: number) {
        if (this.editingItem) {
            const subserie = this.subseries.data.find(s => s.id_subserie == idSubserie);
            if (subserie) {
                this.editingItem.subserie = { ...subserie };
            }
        }
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
                this.consultaDetalleTransferencia(this.idTransferenciaEnviado);
            });
        }
    }

    listadoDocumentos(){
        this.httpDetalleTransferencia.listadoDocumentosDetalle(this.idTransferencia).subscribe(documentos => {
            this.documentos = documentos;
            if (documentos.data.length === 0) {
                this.sweet.alertaGeneral('info', 'Información', 'No se encontraron documentos para esta transferencia.');
            }
        });
    }

    abrirModalDocumento(idDocumento: number): void {
        const modal = document.getElementById('modalVerDocumento');

        if (modal) {
            modal.classList.add('show');
            modal.style.display = 'block';
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('role', 'dialog');
        }

        this.httpDetalleTransferencia.verDocumento(idDocumento).subscribe(documento => {
            this.nombreDocumentoModal = documento.nombre_documento;
            this.urlDocumentoModal = `http://localhost:8000/storage/${documento.url_documento}`;
            /* this.urlDocumentoModal = `http://172.22.3.102/storage/${documento.url_documento}`; */
        });
    }

    abrirModalAgregarDocumentos(idDocumento: number): void {
        const modal = document.getElementById('modalAgregarDocumento');

        if (modal) {
            modal.classList.add('show');
            modal.style.display = 'block';
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('role', 'dialog');
        }
    }

    cerrarModalAgregarDocumentos(): void {
        const modal = document.getElementById('modalAgregarDocumento');
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
            modal.removeAttribute('aria-modal');
            modal.removeAttribute('role');
        }
        this.nombreDocumentoModal = '';
        this.urlDocumentoModal = '';
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

    // Eliminar documento adjunto
    eliminarDocumentoAdjunto(idDocumentoTransferencia: number): void {
        this.httpDetalleTransferencia.deleteDocumentoTransferencia(idDocumentoTransferencia).subscribe(response => {
            this.sweet.alertaGeneral(response.status, response.titulo, response.mensaje);
            this.listadoDocumentos();
        });
    }

    // Seleccionar archivo desde input
    onArchivoSeleccionado(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.archivoSeleccionado = input.files[0];
        } else {
            this.archivoSeleccionado = null;
        }
    }

    // Registrar documento adjunto
    registrarDocumentoAdjunto(): void {
        if (!this.archivoSeleccionado) {
            this.sweet.alertaGeneral('warning', 'Sin archivo', 'Debe seleccionar un archivo para adjuntar.');
            return;
        }

        this.httpDetalleTransferencia.registrarDocumentoTransferencia(this.idTransferencia, this.archivoSeleccionado)
            .subscribe(response => {
              console.log(response);

                this.sweet.alertaGeneral(response.status, response.titulo, response.mensaje);
                this.listadoDocumentos();
                this.cerrarModalAgregarDocumentos();

            });
    }

    cambiarEstadoSolicitud(): void {
      console.log(this.idSolicitud);

        this.httpTransferencia.updateCorreccionSolicitudTransferencia(this.idSolicitud).subscribe(response => {
          console.log(response);
            this.sweet.alertaGeneral(response.icono, response.titulo, response.mensaje);
            this.routerRegresa.navigateByUrl('/main/transferencias/listadoSolicitudes');
        });
    }

}
