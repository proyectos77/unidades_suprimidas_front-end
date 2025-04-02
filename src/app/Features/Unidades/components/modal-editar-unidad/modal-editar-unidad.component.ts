import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartamentosService } from '../../../../Core/services/departamentos.service';
import { SweetAlertService } from '../../../../Core/services/sweet-alert.service';
import { MunicipiosService } from '../../../../Core/services/municipios.service';
import { UnidadesService } from '../../services/unidades.service';
import { GetAllDepartamentos } from '../../../../Core/interfaces/get-all-departamentos';
import { GetAllMunicipiosPorDepartamento } from '../../../../Core/interfaces/get-all-municipios-por-departamento';
import { StoreUnidades } from '../../interfaces/store-unidades';
import { NgFor } from '@angular/common';
import { DatumUnidad } from '../../interfaces/get-all-unidades';


@Component({
  selector: 'app-modal-editar-unidad',
  imports: [NgFor, ReactiveFormsModule],
  templateUrl: './modal-editar-unidad.component.html',
  styleUrl: './modal-editar-unidad.component.css'
})
export class ModalEditarUnidadComponent implements OnInit, OnChanges{

      @Input() unidad!: DatumUnidad;
      @Output() unidadEditada: EventEmitter<void> = new EventEmitter();
      @ViewChild('cerrarModal') cerrarModal!: ElementRef;

      public formularioEditarUnidad!: FormGroup;
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

      constructor(
          private httDepartamentos: DepartamentosService,
          private form: FormBuilder,
          private sweet: SweetAlertService,
          private httMunicipios: MunicipiosService,
          private httUnidades: UnidadesService
      ) {}

      ngOnInit(): void {
          this.listadoDepartamentos();
          this.formularioEditarUnidad = this.formularioEditarUnidades();
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
        }
      }

      cargarDatosFormulario(unidad: DatumUnidad):void{
          this.formularioEditarUnidad.patchValue({
              'nombre': unidad.nombre,
              'sigla': unidad.sigla,
              'padreUnidad': unidad.padre,
              'departamentos': unidad.idDepartamento,
              'idMunicipio': unidad.idMunicipio
          });
      }

      validarFormulario():void{
          if (this.formularioEditarUnidad.invalid) {
              this.sweet.alertaCamposInvalidosFormularios();

              return Object.values(this.formularioEditarUnidad.controls).forEach(controlls =>{
                  controlls.markAllAsTouched();
              });
          }else{
              let dataForm = this.crearDataFormulario();
              this.editarUnidad(dataForm);
          }
      }

      crearDataFormulario():StoreUnidades{
          const data = {
              ...this.formularioEditarUnidad.value
          }
          return data;
      }

      editarUnidad(data: StoreUnidades):void{
          this.httUnidades.updateUnidad(data, this.unidad.id_unidad).subscribe(unidad =>{
              this.sweet.alertaGeneral(unidad.icono, unidad.titulo, unidad.mensaje);
              if (unidad.statusCode == 200) {
                  this.cerrarModales();
              }
          })
      }

      cerrarModales():void{
          this.cerrarModal.nativeElement.click();
          this.unidadEditada.emit();
      }
}
