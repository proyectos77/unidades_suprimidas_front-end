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

@Component({
  selector: "app-registro-detalle-unidad",
  imports: [NgFor, ReactiveFormsModule],
  templateUrl: "./registro-detalle-unidad.component.html",
  styleUrl: "./registro-detalle-unidad.component.css",
})
export default class RegistroDetalleUnidadComponent implements OnInit {
  public formDetalle!: FormGroup;
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
    private httpDetalleUnidad: DetalleUnidadService

  ) {}

  ngOnInit(): void {
    this.listadoUnidades();
    this.formDetalle = this.formularioDetalleUnidad();
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

  listadoUnidades(): void {
    this.httUnidades.listUnidadesSelect().subscribe((listadoUnidades) => {
        this.unidadesSelect = listadoUnidades;
    });
  }

  validarFormulario(): void {
      if (this.formDetalle.invalid) {
          console.log('entro');

          this.sweet.alertaCamposInvalidosFormularios();
          return Object.values(this.formDetalle.controls).forEach((control) => {
            control.markAsTouched();
          });
      }else{
          let dataform = this.crearDataForm();
          this.sweet.alertaDeConfirmacionRegistro().then((resultado) => {
            if (resultado.isConfirmed) {
                this.registroDetalleUnidad(dataform);
            }
          });
      }
  }

  crearDataForm(): StoreDetalleUnidad {
      const data = {
        ...this.formDetalle.value
      };

      return data;
  }

  registroDetalleUnidad(data: StoreDetalleUnidad): void {
    console.log(data);

      this.httpDetalleUnidad.storeDetalleUnidad(data).subscribe((detalle) => {
          this.sweet.alertaGeneral(detalle.icono, detalle.titulo, detalle.mensaje);
          if (detalle.statusCode = 200) {
              this.limpiarForm();
          }
      });
  }

  limpiarForm(): void {
      this.formDetalle.reset();
  }
}
