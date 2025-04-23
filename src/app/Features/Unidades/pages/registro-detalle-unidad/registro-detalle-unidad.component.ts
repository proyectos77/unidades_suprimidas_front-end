import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { UnidadesService } from "../../services/unidades.service";
import { NgFor } from "@angular/common";
import { GetListUnidadesSelect } from "../../interfaces/get-list-unidades-select";
import { SweetAlertService } from "../../../../Core/services/sweet-alert.service";
import { StoreDetalleUnidad } from "../../interfaces/sotre-detalleUnidad";
import { DetalleUnidadService } from "../../services/detalleUnidad.service";
import { StoreArchivoDetalleUnidad } from "../../interfaces/store-archivo-detalle-unidad";
import { ArchivoDetalleUnidadService } from "../../services/archivo-detalle-unidad.service";

@Component({
  selector: "app-registro-detalle-unidad",
  imports: [NgFor, ReactiveFormsModule],
  templateUrl: "./registro-detalle-unidad.component.html",
  styleUrl: "./registro-detalle-unidad.component.css",
})
export default class RegistroDetalleUnidadComponent implements OnInit {
  public formDetalle!: FormGroup;
  public formArchivo!: FormGroup;
  public unidadesSelect: GetListUnidadesSelect = {
    statusCode: 0,
    titulo: "",
    mensaje: "",
    icono: "",
    data: [],
  };
  constructor(
    private httUnidades: UnidadesService,
    private formulario: FormBuilder,
    private sweet: SweetAlertService,
    private httpDetalleUnidad: DetalleUnidadService,
    private httArchivo: ArchivoDetalleUnidadService
  ) {}

  ngOnInit(): void {
    this.listadoUnidades();
    this.formDetalle = this.formularioDetalleUnidad();
    this.formArchivo = this.formularioArchivo();
  }

  formularioDetalleUnidad(): FormGroup {
      return (this.formDetalle = this.formulario.group({
        idUnidad: ['', Validators.required],
        actoAdministrativoCreacion: [null, Validators.required],
        actoAdministrativoDesactivacion: [null, Validators.required],
        fechaCreacionUnidad: [null, Validators.required],
        fechaDesactivacionUnidad: [null, Validators.required],
        puestoMandoAdelantado: [null, Validators.required],
        puestoMandoAtrasado: [null, Validators.required],
        observacion: [null, Validators.required],
      }));
  }

  formularioArchivo(): FormGroup{
      return (this.formArchivo = this.formulario.group({
         numero_cajas: ['', Validators.required],
         numero_carpetas: ['', Validators.required],
         numero_folio: ['', Validators.required]
      }));
  }

  listadoUnidades(): void {
    this.httUnidades.listUnidadesSelect().subscribe((listadoUnidades) => {
        this.unidadesSelect = listadoUnidades;
    });
  }

  validarFormulario(): void {

      let error = false;

      if (this.formDetalle.invalid) {
          return Object.values(this.formDetalle.controls).forEach((control) => {
              error = true;
              control.markAsTouched();
          });
      }

      if(this.formArchivo.invalid){
          return Object.values(this.formArchivo.controls).forEach((control) => {
              error = true;
              control.markAsTouched();
          });
      }

      if (error) {
          this.sweet.alertaCamposInvalidosFormularios();
          return;
      }

      let dataform = this.crearDataForm();
      this.registroDetalleUnidad(dataform);
  }

  crearDataForm(): StoreDetalleUnidad {
      const data = {
        ...this.formDetalle.value
      };

      return data;
  }

  registroDetalleUnidad(data: StoreDetalleUnidad): void {
      this.httpDetalleUnidad.storeDetalleUnidad(data).subscribe((detalle) => {
          if (detalle.statusCode = 200) {
              let dataFormArchivo = this.crearDataFormArchivo();
              this.registroArchivo(dataFormArchivo);
          }
      });
  }

  crearDataFormArchivo(): StoreArchivoDetalleUnidad{
      const data = {
        ...this.formArchivo.value
      };

      return data;
  }

  registroArchivo(data: StoreArchivoDetalleUnidad):void{
      this.httArchivo.storeArchivo(data).subscribe(archivo =>{
          console.log(archivo);

          this.sweet.alertaGeneral(archivo.icono, archivo.titulo, archivo.mensaje);

      })
  }

  limpiarForm(): void {
      this.formDetalle.reset();
      this.formDetalle.get('idUnidad')?.setValue('');
  }
}
