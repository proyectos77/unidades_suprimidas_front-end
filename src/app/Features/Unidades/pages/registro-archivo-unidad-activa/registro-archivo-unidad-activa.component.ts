
import { Component, Input, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { UnidadesService } from '../../services/unidades.service';
import { SweetAlertService } from '../../../../Core/services/sweet-alert.service';
import { GetListadoAnios } from '../../interfaces/get-listado-anios';
import { RegistroAnioArchivoUnidadActivaComponent } from "../../components/registro-anio-archivo-unidad-activa/registro-anio-archivo-unidad-activa.component";
import { Modal } from 'bootstrap';

import { LsitadoArchivoPorUnidad } from '../../../Transferencias/interfaces/lsitado-archivo-por-unidad';
import { TransferenciasService } from '../../../../Core/services/transferencias.service';

declare var bootstrap: any;

@Component({
  selector: 'app-registro-archivo-unidad-activa',
  standalone: true,
  imports: [CommonModule, NgFor, RegistroAnioArchivoUnidadActivaComponent],
  templateUrl: './registro-archivo-unidad-activa.component.html',
  styleUrl: './registro-archivo-unidad-activa.component.css'
})
export default class RegistroArchivoUnidadActivaComponent implements OnInit {



  public idUnidadSeleccinada: number = 0;
  private route = inject(ActivatedRoute);
  public rutaUnidad: string = '';
  public cargarModalAnio: boolean = false;


  public bootstrapModal: any;
  public bootstrapModalRegistroArchivo: any;

  public anios!: LsitadoArchivoPorUnidad;

  constructor(
      private httpUnidades: UnidadesService,
      private sweet: SweetAlertService,
      private cdr: ChangeDetectorRef,
      private httpTransferencias: TransferenciasService,
  ){}

  ngOnInit(): void {
      console.log(this.idUnidadSeleccinada);

      this.obtenerParametroId();
      this.rutaUnidadActiva(this.idUnidadSeleccinada);
      this.listaAnios();
      this.cdr.detectChanges();
  }

  listaAnios(): void {
      this.httpTransferencias.getAllArchivoPorUnidad(this.idUnidadSeleccinada).subscribe((anioRegistro) => {
          this.anios = anioRegistro;
      });
  }

  obtenerParametroId(): void {
      if (!this.route) {
          console.error('ActivatedRoute no está disponible');
          return;
      }

      let parametro = this.route.snapshot?.paramMap?.get('id');
      this.idUnidadSeleccinada = (parametro !== null && parametro !== undefined) ? parseInt(parametro) : 0;

  }

  rutaUnidadActiva(idUnidad: number): void {
      this.httpUnidades.rutaUnidadActiva(idUnidad).subscribe({
          next: (respuesta) => {
              this.rutaUnidad = respuesta.data;
          },
          error: (error) => {
              this.sweet.alertaGeneral('error', 'Error', 'Ocurrió un error al obtener la ruta de la unidad activa.');
          },
      });
  }

  abrirModalRegistroAnio():void{
      this.cargarModalAnio = true;
      setTimeout(() => {
          const modalAnio = document.getElementById('modalRegistroAnioUnidadActiva');
          this.bootstrapModalRegistroArchivo = new bootstrap.Modal(modalAnio);
          this.bootstrapModalRegistroArchivo.show();
      },100)
  }

  regresar() {
      window.history.back();
  }

  prueba(data:any){
      console.log('prueba: ' + data);
  }

}



