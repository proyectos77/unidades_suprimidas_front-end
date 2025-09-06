import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute, Data } from '@angular/router';
import { TransferenciasService } from '../../services/transferencias.service';
import { DetalleTransferenciasService } from '../../services/detalle-transferencias.service';
import { ListadoDetalleSolicitud } from '../../interfaces/listado-detalle-solicitud';
import { NgFor, NgIf } from '@angular/common';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { ListadoDocumentosDetalle } from '../../interfaces/listado-documentos-detalle';
import { ReactiveFormsModule } from '@angular/forms';
import { UrlDocumentosPipe } from '../../../../Shared/Pipes/url-documentos.pipe';
import { SweetAlertService } from '../../../../Core/services/sweet-alert.service';
import { DataUpdateSolicitud } from '../../interfaces/data-update-solicitud';
import { UsuariosServicesService } from '../../../Usuarios/services/usuarios-services.service';
import { LoginService } from '../../../../Auth/services/login.service';

@Component({
  selector: 'app-detalle-solicitu-transferencia',
  imports: [RouterLink, NgFor, NgxChartsModule, ReactiveFormsModule, UrlDocumentosPipe, NgIf],
  templateUrl: './detalle-solicitu-transferencia.component.html',
  styleUrl: './detalle-solicitu-transferencia.component.css'
})
export default class DetalleSolicituTransferenciaComponent implements OnInit {

  public data: any[] = [];
  view: [number, number] = [800, 250]; // Dimensiones [ancho, alto]

  // Opciones del gráfico
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = '';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = '';
  legendTitle: string = 'Porcentajes';
  customColorScheme = {
      name: 'custom', // Dale un nombre
      selectable: true,
      group: ScaleType.Ordinal, // Tipo de escala, 'Ordinal' es común
      domain: ['#198754', '#ffc107'] // Tus colores personalizados aquí
    // Por ejemplo, un azul para 'Archivo Transferido' y un naranja para 'Archivo Faltante'
  };

  public permiso: boolean = false;

  constructor(
      private httpDetalleTransferencia: DetalleTransferenciasService,
      private sweet: SweetAlertService,
      private httpTransferencia: TransferenciasService,
      private httpLogin: LoginService,
      private routerRegresa: Router
  ) {}


  private route = inject(ActivatedRoute);
  public documentos: ListadoDocumentosDetalle = {
      statusCode: 0,
      titulo:     '',
      mensaje:    '',
      icono:      '',
      data:       []
  }
  public filterPost:string = '';
  public detalle: ListadoDetalleSolicitud = {
      statusCode: 0,
      titulo:     '',
      mensaje:    '',
      icono:      '',
      data:       []
  }

  private idTransferencia: number = 0;
  private idSolicitudTransferencia: number = 0;
  public estadoSolicitud: number = 0;
  public observacion: string = '';


  public nombreDocumentoModal: string = '';
  public urlDocumentoModal: string = '';


  ngOnInit(): void {
      let estadoPermiso = this.httpLogin.datosSesion().idTipoUsuario;
      if (estadoPermiso == 1 || estadoPermiso == 3) {
          this.permiso = true;
      }

      let parametro2 = this.route.snapshot.paramMap.get('idSolicitudTransferencia');
      this.idSolicitudTransferencia = (parametro2 !== null) ? parseInt(parametro2) : 0;

      this.infoSolicitud(this.idSolicitudTransferencia);

  }

  infoSolicitud(idSolicitudTransferencia: number){
      this.httpTransferencia.getInformacionSolicitudTransferencia(idSolicitudTransferencia).subscribe(solicitud => {
          this.estadoSolicitud = solicitud.data[0].estado_solicitud_transferencia;
          this.idTransferencia = solicitud.data[0].id_transferencia;
          this.observacion = solicitud.data[0].observacion_solicitud_transferencia;
        console.log('estado = ' + this.estadoSolicitud);

          this.listadoDetalles();
          this.listadoDocumentos();
      });

  }

  listadoDetalles(){
      this.httpDetalleTransferencia.listadoDetalleTransferencia(this.idTransferencia).subscribe(detalle => {
          console.log(detalle);

          this.detalle = detalle;

          let totalTransferido: number = 0;

          detalle.data.forEach(element => {
              totalTransferido +=  parseFloat(element.porcentaje_detalle_transferencia as any);
          });

          if (detalle.data.length === 0) {
              this.data = [
                { name: 'Transferido', value: 0 },
                { name: 'Total', value: 100 }
              ];
          } else {
              this.data = [
                { name: 'Transferido', value: totalTransferido },
                { name: 'Total', value: 100 - totalTransferido }
              ];
          }
      });
  }

  listadoDocumentos(){
      this.httpDetalleTransferencia.listadoDocumentosDetalle(this.idTransferencia).subscribe(documentos => {
          this.documentos = documentos;
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

  aprobarSolicitud(): void {
      let aprobacion = this.sweet.alertaDeConfirmacionAprobacion();
      aprobacion.then((result) => {
          if (result.isConfirmed) {
              let data = this.dataActualizacionSolicitud(1);
              this.httpTransferencia.updateEstadoSolicitudTransferencia(this.idSolicitudTransferencia, data).subscribe(respuesta => {
                  this.sweet.alertaGeneral(respuesta.icono, respuesta.titulo, respuesta.mensaje);
                  this.estadoSolicitud = 4;
                  this.routerRegresa.navigateByUrl('/main/transferencias/listadoSolicitudes');
              })
          }
      })
  }

  rechazarSolicitud(): void {
      this.sweet.alertaConTexArea('Rechazar solicitud', 'Ingrese la observación del rechazo').then(result => {
          if (result.isConfirmed) {
              const observacion = result.value;
              const data = this.dataActualizacionSolicitud(2, observacion); // estado diferente de 1, por ejemplo 2 para rechazo
              this.httpTransferencia.updateEstadoSolicitudTransferencia(this.idSolicitudTransferencia, data).subscribe(respuesta => {
                  this.sweet.alertaGeneral(respuesta.icono, respuesta.titulo, respuesta.mensaje);
                  this.estadoSolicitud = 5;
                  this.routerRegresa.navigateByUrl('/main/transferencias/listadoSolicitudes');
              });
          }
      });
  }

  dataActualizacionSolicitud(estado: number, observacion: string = 'Solicitud aprobada'):DataUpdateSolicitud{
      const fechaActual = new Date();
      const año = fechaActual.getFullYear();
      const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
      const dia = String(fechaActual.getDate()).padStart(2, '0');
      const fechaFormateada = `${año}/${mes}/${dia}`;

      if (estado === 1) {
          return{
              usuarioAprobo: this.httpLogin.datosSesion().id,
              fechaFin: String(fechaFormateada),
              Observacion: observacion,
              estado: 4
          };
      }else{
          return{
              usuarioAprobo: this.httpLogin.datosSesion().id,
              fechaFin: String(fechaFormateada),
              Observacion: observacion,
              estado: 5
          };
      }
  }



}
