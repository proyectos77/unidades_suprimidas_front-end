import { Component, ElementRef, OnInit, viewChild } from '@angular/core';
import { GetInformacionUnidad } from '../../interfaces/get-informacion-unidad';
import { UnidadesService } from '../../services/unidades.service';
import { SweetAlertService } from '../../../../Core/services/sweet-alert.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ListadoArchivoPorUnidad } from '../../interfaces/listado-archivo-por-unidad';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BuscadorArchivoUnidadPipe } from '../../../../Shared/Pipes/buscador-archivo-unidad.pipe';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { LoginService } from '../../../../Auth/services/login.service';
import { Modal } from 'bootstrap';
import { StoreActualizarArchivoRegistrado } from '../../interfaces/store-actualizar-archivo-registrado';
import { ArchivoDetalleUnidadService } from '../../services/archivo-detalle-unidad.service';

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
    NgxChartsModule,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './vista-detalle-unidad.component.html',
  styleUrl: './vista-detalle-unidad.component.css',
  // No necesitas la propiedad 'animations' aquí porque las animaciones
  // vienen definidas dentro de NgxChartsModule.
})
export default class VistaDetalleUnidadComponent implements OnInit {

  private modalInstance: Modal | null = null;
  private modalActualizar = viewChild<ElementRef>('modalActualizarArchivo');

  public data: any[] = [];
  public unidadSuprimida: boolean = false;
  public unidadActiva: boolean = false;

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
      id_usuario: null,
      padre_unidad: null,
      codigo_unidad_activa: '',
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
            padre: undefined
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
  public perfilUsuario:number = 0;
  public formularioArchivo!: FormGroup;
  private idArchivoRegistradoParaActualizar: number = 0;

  constructor(
      private httpUnidad: UnidadesService,
      private sweet: SweetAlertService,
      private route: ActivatedRoute,
      private router: Router,
      private httpLogin: LoginService,
      private formulario: FormBuilder,
      private httpArchivo: ArchivoDetalleUnidadService,
  ) {}

  ngOnInit(): void {
      this.getInformacionUnidad();
      this.perfilUsuario = this.httpLogin.datosSesion().idTipoUsuario;
      this.formularioArchivo = this.form();
  }

  getInformacionUnidad(): void {
      let parametro = this.route.snapshot.paramMap.get('id');
      let id = (parametro !== null) ? parseInt(parametro) : 0;

      this.httpUnidad.getInformacionUnidad(id).subscribe({
          next: (informacion) => {
              if (informacion.statusCode === 200) {
                  this.informacionUnidad = informacion;
                  this.getArchivoUnidad(informacion.data.detalle_unidad?.id_detalle ?? 0, 1);
                  if (informacion.data.id_estado == 6) {
                      this.unidadSuprimida = true;
                      this.unidadActiva = false;
                  }else{
                      this.unidadSuprimida = false;
                      this.unidadActiva = true;
                  }
              }
          },
          error: (error) => {
              window.history.back();
          },
      });
  }

  getArchivoUnidad(idDetalleUnidad: number, page:number):void{
      this.httpUnidad.detalleArchivoPorUnidad(idDetalleUnidad, page).subscribe(archivo => {
          if (archivo.data.length === 0) {


              this.sweet.alertaGeneral('info', 'No se encontraron registros', 'No hay archivos registrados para esta unidad');
          }else{

            const registros = archivo.data;
            const totalTransferido = registros.reduce((acc, item) => acc + Number(item.porcentaje_transferencia),0);
            const totalPendiente = registros.reduce((acc, item) => acc + Number(item.porcentaje_faltante),0);

            const totalGeneral = totalTransferido + totalPendiente;

            const porcentajeTransferido = Number(((totalTransferido / totalGeneral) * 100).toFixed(1));
            const porcentajePendiente = Number(((totalPendiente / totalGeneral) * 100).toFixed(1));

            this.data = [
              {
                name: 'Archivo Transferido',
                value: porcentajeTransferido
              },
              {
                name: 'Archivo Pendiente',
                value: porcentajePendiente
              }
            ];
              this.informacionArchivoUnidad = archivo;
          }
      });
  }

  formatAsPercentage(value: number): string {
    return `${value}%`;
  }

  abrirModal(cajas: number, carpetas: number, folios: number, otros: number, tomos: number, idArchivoRegistradoParaActualizar: number):void {
      this.idArchivoRegistradoParaActualizar = idArchivoRegistradoParaActualizar;
      const modal = this.modalActualizar();

      if (modal) {
          this.formularioArchivo.setValue({
              cajas: cajas,
              carpetas: carpetas,
              folios: folios,
              otros: otros,
              tomos: tomos,
          });
          this.modalInstance = new Modal(modal.nativeElement);
          this.modalInstance.show();
      }
  }


  form():FormGroup{
      return this.formulario.group({
          cajas: [0],
          carpetas: [0],
          folios: [0],
          otros: [0],
          tomos: [0],

      });
  }

  actualizarArchivo():void{
      const data = this.dataActualizarArchivo();


      this.httpArchivo.updateArchivo(data, this.idArchivoRegistradoParaActualizar).subscribe(archivo =>{
              if (archivo.statusCode === 200) {
              this.sweet.alertaGeneral(archivo.icono, archivo.titulo, archivo.mensaje);
              this.getArchivoUnidad(this.informacionUnidad.data.detalle_unidad?.id_detalle ?? 0, 1);
          }else{
              this.sweet.alertaGeneral(archivo.icono, archivo.titulo, archivo.mensaje);
          }

          this.closeModal();
      });
  }

  closeModal():void{
      if (this.modalInstance) {
          this.modalInstance.hide();
      }
  }

  dataActualizarArchivo(): StoreActualizarArchivoRegistrado{
      return {
          ...this.formularioArchivo.value,
      };
  }


  regresar() {
      window.history.back();
  }

}
