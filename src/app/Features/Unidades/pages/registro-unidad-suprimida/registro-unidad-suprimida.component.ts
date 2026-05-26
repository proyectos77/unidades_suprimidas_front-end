import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { DepartamentosService } from '../../../../Core/services/departamentos.service';
import { SweetAlertService } from '../../../../Core/services/sweet-alert.service';
import { MunicipiosService } from '../../../../Core/services/municipios.service';
import { UnidadesService } from '../../services/unidades.service';
import { LoginService } from '../../../../Auth/services/login.service';
import { DetalleUnidadService } from '../../services/detalleUnidad.service';
import { ArchivoDetalleUnidadService } from '../../services/archivo-detalle-unidad.service';
import { GetAllDepartamentos } from '../../../../Core/interfaces/get-all-departamentos';
import { GetAllMunicipiosPorDepartamento } from '../../../../Core/interfaces/get-all-municipios-por-departamento';
import { GetListUnidadesSelect } from '../../interfaces/get-list-unidades-select';
import { GetListUnidadesConDetalle } from '../../interfaces/get-list-unidades-con-detalle';
import { GetListadoAnios } from '../../interfaces/get-listado-anios';
import { StoreUnidades } from '../../interfaces/store-unidades';
import { StoreDetalleUnidad } from '../../interfaces/sotre-detalleUnidad';
import { StoreArchivoDetalleUnidad } from '../../interfaces/store-archivo-detalle-unidad';

@Component({
  selector: 'app-registro-unidad-suprimida',
  imports: [ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './registro-unidad-suprimida.component.html',
  styleUrls: ['./registro-unidad-suprimida.component.css']
})
export default class RegistroUnidadSuprimidaComponent implements OnInit {
  @ViewChild('registroDetalleUnidad') registroDetalleUnidadBtn!: ElementRef;
  @ViewChild('registroArchivoUnidad') registroArchivoUnidadBtn!: ElementRef;

  public formularioUnidadSuprimida!: FormGroup;
  private idUsuario: number = 0;
  private dependenciaUser: number = 0;

  public departamentos: GetAllDepartamentos = {
    icono: '', mensaje: '', statusCode: 0, titulo: '', data: []
  };
  public municipios: GetAllMunicipiosPorDepartamento = {
    titulo: '', mensaje: '', icono: '', statusCode: 0, data: []
  };
  public unidadesSelect: GetListUnidadesSelect = {
    statusCode: 0, titulo: '', mensaje: '', icono: '', data: []
  };
  public unidadesConDetalle: GetListUnidadesConDetalle = {
    statusCode: 0, titulo: '', mensaje: '', icono: '', data: []
  };
  public anios: GetListadoAnios = { statusCode: 0, data: [] };
  public unidadActiva: number = 0;

  constructor(
    private httDepartamentos: DepartamentosService,
    private form: FormBuilder,
    private sweet: SweetAlertService,
    private httMunicipios: MunicipiosService,
    private httUnidades: UnidadesService,
    private httpLogin: LoginService,
    private httpDetalleUnidad: DetalleUnidadService,
    private httArchivo: ArchivoDetalleUnidadService,
  ) {
    this.idUsuario = this.httpLogin.datosSesion().id;
    this.dependenciaUser = this.httpLogin.datosSesion().idDependencia;
  }

  get unidadFormGroup(): FormGroup {
    return this.formularioUnidadSuprimida.get('unidad') as FormGroup;
  }

  get detalleUnidadFormGroup(): FormGroup {
    return this.formularioUnidadSuprimida.get('detalleUnidad') as FormGroup;
  }

  get archivoUnidadFormGroup(): FormGroup {
    return this.formularioUnidadSuprimida.get('archivoUnidad') as FormGroup;
  }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarDatos();
    this.configurarSuscripciones();
  }

  private cargarDatos(): void {
    this.listadoDepartamentos();
    this.cargarUnidadesDetalle();
    this.cargarUnidadesArchivo();
    this.listaAnios();
  }

  private cargarUnidadesDetalle(): void {
    this.listadoUnidades(this.dependenciaUser);
  }

  private cargarUnidadesArchivo(): void {
    this.listadoUnidadesConDetalle(this.dependenciaUser);
  }

  private configurarSuscripciones(): void {
    this.formularioUnidadSuprimida.get('unidad.departamentos')?.valueChanges.subscribe(idDepartamento => {
      this.listarMunicipios(idDepartamento);
    });

    this.formularioUnidadSuprimida.get('archivoUnidad.id_detalle')?.valueChanges.subscribe((idDetalle) => {
      const unidadEncontrada = this.unidadesConDetalle.data.some(elemento => {
        return elemento.id_detalle_unidad == idDetalle && elemento.estado_unidad == 1;
      });
      this.unidadActiva = unidadEncontrada ? 1 : 0;
    });
  }

  private inicializarFormulario(): void {
    this.formularioUnidadSuprimida = this.form.group({
      unidad: this.form.group({
        nombre: ['', [Validators.required]],
        division: ['', [Validators.required]],
        sigla: ['', [Validators.required]],
        unidad_que_asume: ['', [Validators.required]],
        departamentos: ['', [Validators.required]],
        idMunicipio: ['', [Validators.required]],
        estado: [true, [Validators.required]]
      }),
      detalleUnidad: this.form.group({
        idUnidad: ['', Validators.required],
        actoAdministrativoCreacion: [null, Validators.required],
        actoAdministrativoDesactivacion: [null, Validators.required],
        fechaCreacionUnidad: [null, Validators.required],
        fechaDesactivacionUnidad: [null, Validators.required],
        puestoMandoAdelantado: [null],
        puestoMandoAtrasado: [null],
        planReorganizacionDiorg: [null],
        observacion: [null, Validators.required],
      }),
      archivoUnidad: this.form.group({
        id_detalle: ['', Validators.required],
        anio_registro_archivo: ['', Validators.required],
        numero_cajas: ['', Validators.required],
        numero_carpetas: ['', Validators.required],
        numero_folio: ['', Validators.required],
        otros: [''],
        tomos: [''],
        seccion: [''],
        serie: [''],
        subserie: [''],
        cantidad_cajas: [''],
        cantidad_carpetas: [''],
        cantidad_otros: [''],
        cantidad_folios: [''],
      })
    });
  }

  private listadoDepartamentos(): void {
    this.httDepartamentos.getAllDepartamentos().subscribe(departamentos => {
      if (departamentos.statusCode == 200 && departamentos.data.length > 0) {
        this.departamentos.data = departamentos.data;
      }
    });
  }

  private listarMunicipios(id: number): void {
    if (id) {
      this.httMunicipios.getAllMunicipiosPorDepartamento(id).subscribe(municipios => {
        this.municipios = municipios;
      });
    } else {
      this.municipios = { titulo: '', mensaje: '', icono: '', statusCode: 0, data: [] };
    }
  }

  private listadoUnidades(idDependencia: number): void {
    this.httUnidades.listUnidadesSelect(idDependencia).subscribe((listadoUnidades) => {
      this.unidadesSelect = listadoUnidades;
    });
  }

  private listadoUnidadesConDetalle(idDependencia: number): void {
    this.httUnidades.listUnidadesConDetalle(idDependencia).subscribe((listadoUnidades) => {
      this.unidadesConDetalle = listadoUnidades;
    });
  }

  private listaAnios(): void {
    this.httUnidades.listadoAnios().subscribe((anios) => {
      this.anios = anios;
    });
  }

  validarFormularioUnidad(): void {
    const grupo = this.formularioUnidadSuprimida.get('unidad');
    if (!(grupo instanceof FormGroup)) return;
    if (grupo.invalid) {
      this.sweet.alertaCamposInvalidosFormularios();
      Object.values(grupo.controls).forEach(control => control.markAllAsTouched());
      return;
    }
    const data: StoreUnidades = { ...grupo.value, usuario: this.idUsuario };
    this.httUnidades.storeUnidad(data).subscribe(unidad => {
      this.sweet.alertaGeneral(unidad.icono, unidad.titulo, unidad.mensaje);
      if (unidad.statusCode == 200) {
        this.limpiarFormUnidad();
        this.cargarUnidadesDetalle();
        this.cargarUnidadesArchivo();
        this.irAlTabDetalle();
      }
    });
  }

  validarFormularioDetalleUnidad(): void {
    const grupo = this.formularioUnidadSuprimida.get('detalleUnidad');
    if (!(grupo instanceof FormGroup)) return;
    if (grupo.invalid) {
      this.sweet.alertaCamposInvalidosFormularios();
      Object.values(grupo.controls).forEach(control => control.markAllAsTouched());
      return;
    }
    const data: StoreDetalleUnidad = { ...grupo.value };
    this.httpDetalleUnidad.storeDetalleUnidad(data).subscribe(detalle => {
      this.sweet.alertaGeneral(detalle.icono, detalle.titulo, detalle.mensaje);
      this.limpiarFormDetalleUnidad();
      this.cargarUnidadesDetalle();
      this.cargarUnidadesArchivo();
      this.irAlTabArchivo();
    });
  }

  validarFormularioArchivoUnidad(): void {
    const grupo = this.formularioUnidadSuprimida.get('archivoUnidad');
    if (!(grupo instanceof FormGroup)) return;
    if (grupo.invalid) {
      this.sweet.alertaCamposInvalidosFormularios();
      Object.values(grupo.controls).forEach(control => control.markAllAsTouched());
      return;
    }
    const data: StoreArchivoDetalleUnidad = { ...grupo.value };
    this.httArchivo.storeArchivo(data).subscribe(detalle => {
      this.sweet.alertaGeneral(detalle.icono, detalle.titulo, detalle.mensaje);
      if (detalle.statusCode == 200) {
        this.limpiarFormArchivoUnidad();
      }
    });
  }

  private irAlTabDetalle(): void {
    this.registroDetalleUnidadBtn.nativeElement.click();
  }

  private irAlTabArchivo(): void {
    this.registroArchivoUnidadBtn.nativeElement.click();
  }

  limpiarFormUnidad(): void {
    const grupo = this.formularioUnidadSuprimida.get('unidad');
    if (!(grupo instanceof FormGroup)) return;
    grupo.reset();
    grupo.get('departamentos')?.setValue('');
    grupo.get('idMunicipio')?.setValue('');
  }

  limpiarFormDetalleUnidad(): void {
    const grupo = this.formularioUnidadSuprimida.get('detalleUnidad');
    if (!(grupo instanceof FormGroup)) return;
    grupo.reset();
    grupo.get('idUnidad')?.setValue('');
  }

  limpiarFormArchivoUnidad(): void {
    const grupo = this.formularioUnidadSuprimida.get('archivoUnidad');
    if (!(grupo instanceof FormGroup)) return;
    grupo.reset();
    grupo.get('id_detalle')?.setValue('');
    grupo.get('anio_registro_archivo')?.setValue('');
  }
}
