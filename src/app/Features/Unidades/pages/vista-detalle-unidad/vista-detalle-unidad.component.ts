import { Component, OnInit } from '@angular/core';
import { GetInformacionUnidad } from '../../interfaces/get-informacion-unidad';
import { UnidadesService } from '../../services/unidades.service';
import { SweetAlertService } from '../../../../Core/services/sweet-alert.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ListadoArchivoPorUnidad } from '../../interfaces/listado-archivo-por-unidad';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BuscadorArchivoUnidadPipe } from '../../../../Shared/Pipes/buscador-archivo-unidad.pipe';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-vista-detalle-unidad',
  // --- LA SOLUCIÓN ESTÁ AQUÍ ---

  // -----------------------------
  imports: [
    RouterLink,
    NgFor,
    FormsModule,
    BuscadorArchivoUnidadPipe,
    CommonModule,
    NgxChartsModule
  ],
  templateUrl: './vista-detalle-unidad.component.html',
  styleUrl: './vista-detalle-unidad.component.css',
  // No necesitas la propiedad 'animations' aquí porque las animaciones
  // vienen definidas dentro de NgxChartsModule.
})
export default class VistaDetalleUnidadComponent implements OnInit {

  public data: any[] = [];

  view: [number, number] = [800, 150]; // Dimensiones [ancho, alto]

  // Opciones del gráfico
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = '';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = '';
  legendTitle: string = 'Estados';
  customColorScheme = {
      name: 'custom', // Dale un nombre
      selectable: true,
      group: ScaleType.Ordinal, // Tipo de escala, 'Ordinal' es común
      domain: ['#198754', '#ffc107'] // Tus colores personalizados aquí
    // Por ejemplo, un azul para 'Archivo Transferido' y un naranja para 'Archivo Faltante'
  };



  public informacionUnidad: GetInformacionUnidad = {
    statusCode: 0,
    titulo: '',
    mensaje: '',
    icono: '',
    data: {
      id_unidad: 0,
      nombre_unidad: '',
      sigla_unidad: '',
      unidad_superior_jerarquicamente_unidad: '',
      unidad_que_asume_archivo_unidad: '',
      id_municipio: 0,
      fecha_creacion_unidad: '',
      fecha_actualizacion_unidad: '',
      id_estado: 0,
      detalle_unidad: {
        id_detalle: 0,
        acto_administrativo_creacion_detalle: '',
        acto_administrativo_desactivacion_detalle: '',
        fecha_creacion_unidad_detalle: '',
        fecha_desactivacion_unidad_detalle: '',
        puesto_mando_adelantado_detalle: '',
        puesto_mando_atrasado_detalle: '',
        plan_reorganizacion_diorg_detalle: '',
        observacion_detalle: '',
        id_unidad: 0,
        fecha_creacion_detalle: '',
        fecha_actualizacion_detalle: '',
        id_estado: 0,
        archivo: {
          id_archivo: 0,
          numero_cajas_archivos: 0,
          numero_carpetas_archivo: 0,
          numero_folios_archivo: 0,
          id_detalle: 0,
          fecha_creacion_archivo: '',
          fecha_actualizacion_archivo: '',
          id_estado: 0
        },
      },
      municipio: {
        id_municipio: 0,
        nombre_municipio: '',
        id_departamento: 0,
        fecha_creacion_municipio: '',
        fecha_actualizacion_municipio: '',
        id_estado: 0,
        departamentos: {
          id_departamento: 0,
          nombre_departamento: '',
          fecha_creacion_departamento: '',
          fecha_actualizacion_departamento: '',
          id_estado: 0,
        },
      },
    },
  };

  public informacionArchivoUnidad: ListadoArchivoPorUnidad = {
      statusCode: 0,
      titulo: '',
      mensaje: '',
      icono: '',
      data: [],
      infoPagination: {
          pagina: 0,
          totalRegistro: 0,
          totalRegistrosPorPagina: 0,
          totalPaginas: 0,
      },
  }

  public filterPost: string = '';

  constructor(
      private httpUnidad: UnidadesService,
      private sweet: SweetAlertService,
      private route: ActivatedRoute,
      private router: Router
  ) {}

  ngOnInit(): void {
      this.getInformacionUnidad();
  }

  getInformacionUnidad(): void {
      let parametro = this.route.snapshot.paramMap.get('id');
      let id = (parametro !== null) ? parseInt(parametro) : 0;

      this.httpUnidad.getInformacionUnidad(id).subscribe({
          next: (informacion) => {
              if (informacion.statusCode === 200) {
                  this.informacionUnidad = informacion;
                  this.getArchivoUnidad(informacion.data.detalle_unidad.id_detalle, 1);
              }
          },
          error: (error) => {
              this.router.navigate(['/main/unidades/listadoUnidades']);
          },
      });
  }

  getArchivoUnidad(idDetalleUnidad: number, page:number):void{
      this.httpUnidad.detalleArchivoPorUnidad(idDetalleUnidad, page).subscribe(archivo => {
          this.data = [
              {
                  'name': 'Archivo Transferido',
                  'value' : archivo.data[0].porcentaje_transferencia
              },
              {
                  'name': 'Archivo Pendiente',
                  'value' : archivo.data[0].porcentaje_faltante
              }
          ];
          this.informacionArchivoUnidad = archivo;
      });
  }

  formatAsPercentage(value: number): string {
    return `${value}%`;
  }


}
