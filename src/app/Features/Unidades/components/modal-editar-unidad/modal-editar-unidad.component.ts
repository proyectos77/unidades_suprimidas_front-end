import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, output, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartamentosService } from '../../../../Core/services/departamentos.service';
import { SweetAlertService } from '../../../../Core/services/sweet-alert.service';
import { MunicipiosService } from '../../../../Core/services/municipios.service';
import { UnidadesService } from '../../services/unidades.service';
import { GetAllDepartamentos } from '../../../../Core/interfaces/get-all-departamentos';
import { GetAllMunicipiosPorDepartamento } from '../../../../Core/interfaces/get-all-municipios-por-departamento';
import { StoreUnidades } from '../../interfaces/store-unidades';
import { NgFor, NgIf } from '@angular/common';
import { DatumUnidad } from '../../interfaces/get-all-unidades';
import { GetInformacionUnidad } from '../../interfaces/get-informacion-unidad';
import { StoreDetalleUnidad } from '../../interfaces/sotre-detalleUnidad';
import { DetalleUnidadService } from '../../services/detalleUnidad.service';
import { forkJoin } from 'rxjs';



@Component({
  selector: 'app-modal-editar-unidad',
  imports: [NgFor, ReactiveFormsModule, NgIf],
  templateUrl: './modal-editar-unidad.component.html',
  styleUrl: './modal-editar-unidad.component.css'
})
export class ModalEditarUnidadComponent implements OnInit, OnChanges  {  /* AfterViewInit */

      @Input() unidad!: DatumUnidad;
      @Output() unidadEditada: EventEmitter<void> = new EventEmitter();
      @ViewChild('cerrarModal') cerrarModal!: ElementRef;

      public formularioEditarUnidad!: FormGroup;
      public formularioEditarDetalleUnidad!: FormGroup;
      public seccionEditarDetalle:boolean = false;
      public seccionEditarArchivo:boolean = false;
      public tab: string = 'unidad-tab';

      public departamentos:GetAllDepartamentos = {
          'icono': '',
          'mensaje': '',
          'statusCode': 0,
          'titulo': '',
          'data': []
      };
      public municipios: GetAllMunicipiosPorDepartamento = {
          'titulo': '',
          'mensaje': '',
          'icono': '',
          'statusCode': 0,
          'data': []
      }

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
          unidad_que_asume_archivo_unidad	: '',
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
              id_archivo:                  0,
              numero_cajas_archivos:       0,
              numero_carpetas_archivo:     0,
              numero_folios_archivo:       0,
              id_detalle:                  0,
              fecha_creacion_archivo:      '',
              fecha_actualizacion_archivo: '',
              id_estado:                   0
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

      constructor(

          private httDepartamentos: DepartamentosService,
          private form: FormBuilder,
          private sweet: SweetAlertService,
          private httMunicipios: MunicipiosService,
          private httpUnidades: UnidadesService,
          private httpDetalleUnidad: DetalleUnidadService
      ) {}

      ngOnInit(): void {
          this.seccionEditarDetalle = false
          this.listadoDepartamentos();
          this.formularioEditarUnidad = this.formularioEditarUnidades();
          this.formularioEditarDetalleUnidad = this.formularioEditarDetalle();
          this.formularioEditarUnidad.get('departamentos')?.valueChanges.subscribe(idDepartamento => {
              this.listarMunicipios(idDepartamento);
          });
      }

      formularioEditarUnidades():FormGroup{
          return this.form.group({
              nombre: ['', [Validators.required]],
              sigla: ['', [Validators.required]],
              padreUnidad: ['', [Validators.required]],
              departamentos: ['', [Validators.required]],
              idMunicipio: ['', [Validators.required]]
          });
      }

      formularioEditarDetalle():FormGroup{
          return this.form.group({
              nombreUnidad: [{value: '', disabled: true}, Validators.required],
              actoAdministrativoCreacion: [null, Validators.required],
              actoAdministrativoDesactivacion: [null, Validators.required],
              fechaCreacionUnidad: [null, Validators.required],
              fechaDesactivacionUnidad: [null, Validators.required],
              puestoMandoAdelantado: [null, Validators.required],
              puestoMandoAtrasado: [null, Validators.required],
              observacion: [null, Validators.required],
          });
      }

      listadoDepartamentos():void{
          this.httDepartamentos.getAllDepartamentos().subscribe(departamentos =>{
              if (departamentos.statusCode == 200 && departamentos.data.length > 0) {
                  this.departamentos.data = departamentos.data;
              }
          });
      }

      listarMunicipios(id: number):void{
          if (id) {
              this.httMunicipios.getAllMunicipiosPorDepartamento(id).subscribe(municipios => {
                  this.municipios = municipios;
              })
          }else{
              this.municipios = {
                  'titulo': '',
                  'mensaje': '',
                  'icono': '',
                  'statusCode': 0,
                  'data': []
              }
          }
      }

      ngOnChanges(changes: SimpleChanges): void {
        if (changes['unidad'] && this.unidad && this.unidad.id_unidad != 0) {
            this.cargarDatosFormulario(this.unidad);
            this.consultaDetalleUnidad();
        }
      }

      cargarDatosFormulario(unidad: DatumUnidad):void{
          this.formularioEditarUnidad.patchValue({
              'nombre': unidad.nombre,
              'sigla': unidad.sigla,
              'padreUnidad': unidad.unidad_que_asume_archivo_unidad,
              'departamentos': unidad.idDepartamento,
              'idMunicipio': unidad.idMunicipio
          });
      }

      consultaDetalleUnidad():void{
        this.httpUnidades.getInformacionUnidad(this.unidad.id_unidad).subscribe({
              next: (informacion) => {
                  if (informacion.statusCode === 200) {
                      this.informacionUnidad = informacion;
                     /*  this.ngAfterViewInit(); */
                      this.seccionEditarDetalle = true;
                      this.formularioEditarDetalleUnidad.patchValue({
                          'nombreUnidad': this.informacionUnidad.data.nombre_unidad,
                          'actoAdministrativoCreacion': this.informacionUnidad.data.detalle_unidad.acto_administrativo_creacion_detalle,
                          'actoAdministrativoDesactivacion': this.informacionUnidad.data.detalle_unidad.acto_administrativo_desactivacion_detalle,
                          'fechaCreacionUnidad': this.informacionUnidad.data.detalle_unidad.fecha_creacion_unidad_detalle,
                          'fechaDesactivacionUnidad': this.informacionUnidad.data.detalle_unidad.fecha_desactivacion_unidad_detalle,
                          'puestoMandoAdelantado': this.informacionUnidad.data.detalle_unidad.puesto_mando_adelantado_detalle,
                          'puestoMandoAtrasado': this.informacionUnidad.data.detalle_unidad.puesto_mando_atrasado_detalle,
                          'observacion': this.informacionUnidad.data.detalle_unidad.observacion_detalle,
                      });
                  }
              },
              error: (error) => {
                  console.log(error);
                  this.seccionEditarDetalle = false;
                  /* this.ngAfterViewInit(); */
              },
          });
      }

      validarFormulario():void{

          let error = false;

          if (this.formularioEditarUnidad.invalid) {
              this.sweet.alertaCamposInvalidosFormularios();
              this.tab = 'unidad-tab';
              /* this.ngAfterViewInit(); */
              error = true;
              return Object.values(this.formularioEditarUnidad.controls).forEach(controlls =>{
                  controlls.markAllAsTouched();
              });
          }else if (this.seccionEditarArchivo == true && this.formularioEditarDetalleUnidad.invalid) {
              this.sweet.alertaCamposInvalidosFormularios();
              this.tab = 'detalle-tab';
              /* this.ngAfterViewInit(); */
              error = true;
              return Object.values(this.formularioEditarDetalleUnidad.controls).forEach(controlls =>{
                  controlls.markAllAsTouched();
              });
          }

          const dataFormUnidad = this.crearDataUnidadFormulario();

          if (this.seccionEditarArchivo == true) {
              const dataFormDetalleUnidad = this.crearDataDetalleFormulario();

              forkJoin({
                  unidadEditar: this.httpUnidades.updateUnidad(dataFormUnidad, this.unidad.id_unidad),
                  detalle: this.httpDetalleUnidad.updateDetalleUnidad(this.informacionUnidad.data.detalle_unidad.id_detalle, dataFormDetalleUnidad)
              }).subscribe(({ unidadEditar, detalle }) => {
                  if (unidadEditar.statusCode === 200 && detalle.statusCode === 200) {
                      this.sweet.alertaGeneral('success', 'Actualización exitosa', 'La unidad y su detalle fueron actualizados correctamente.');
                      this.cerrarModales();
                  } else {
                      this.sweet.alertaGeneral('error', 'Error al actualizar', 'Ocurrió un error al actualizar los datos.');
                  }
              }, error => {
                  this.sweet.alertaGeneral('error', 'Error inesperado', 'No se pudo completar la actualización.');
              });
          }else{
              this.editarUnidad(dataFormUnidad);
          }


      }

      crearDataDetalleFormulario():StoreDetalleUnidad{
          const data = {
              ...this.formularioEditarDetalleUnidad.value
          }
          return data;
      }

      crearDataUnidadFormulario():StoreUnidades{
          const data = {
              ...this.formularioEditarUnidad.value
          }
          return data;
      }

      editarUnidad(data: StoreUnidades):void{
          this.httpUnidades.updateUnidad(data, this.unidad.id_unidad).subscribe(unidad =>{
              this.sweet.alertaGeneral(unidad.icono, unidad.titulo, unidad.mensaje);
              if (unidad.statusCode == 200) {
                  this.cerrarModales();
              }
          })
      }

      editarDetalleUnidad(data: StoreDetalleUnidad):void{
          this.httpDetalleUnidad.updateDetalleUnidad(this.informacionUnidad.data.detalle_unidad.id_detalle, data).subscribe(detalle =>{
              this.sweet.alertaGeneral(detalle.icono, detalle.titulo, detalle.mensaje);
              if (detalle.statusCode == 200) {
                  this.cerrarModales();
              }
          });
      }

      cerrarModales():void{
          this.formularioEditarDetalleUnidad.reset();
          this.formularioEditarUnidad.reset();
          this.seccionEditarDetalle = false;
          this.cerrarModal.nativeElement.click();
          this.unidadEditada.emit();
      }

      /* ngAfterViewInit(): void {
          console.log(this.tab);

          // Asegurarse de que la pestaña "home" esté activa después de que la vista se haya inicializado
          const homeTab = document.getElementById(this.tab);
          if (homeTab) {
              homeTab.click();
          }
      } */
}
