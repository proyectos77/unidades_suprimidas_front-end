import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { SweetAlertService } from '../../../../Core/services/sweet-alert.service';
import { ManualesInformacionServiceService } from '../../services/manuales-informacion-service.service';
import { GetAllDocumentacionSistema } from '../../interfaces/get-all-documentacion-sistema';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-modal-cargar-documentacion',
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './modal-cargar-documentacion.component.html',
  styleUrl: './modal-cargar-documentacion.component.css'
})
export default class ModalCargarDocumentacionComponent implements OnInit {


  public formularioDocumentacion!: FormGroup;
  private archivoSeleccionado: File | null = null;
  public documentacionSistema: GetAllDocumentacionSistema ={
      statusCode: 0,
      titulo: '',
      mensaje: '',
      icono: '',
      data: [],
      infoPagination: {
          pagina: 0,
          totalRegistro: 0,
          totalRegistrosPorPagina: 0,
          totalPaginas: 0
      }
  }

  constructor(
      private formBuilder: FormBuilder,
      private sweet: SweetAlertService,
      private manualesInformacionService: ManualesInformacionServiceService,
  ){}

  ngOnInit(): void {
      this.formularioDocumentacion = this.inicializarFormulario();
      this.getAllDocumentacionSistema();
  }

  onArchivoSeleccionado(event: Event): void {
      const input = event.target as HTMLInputElement;
      this.archivoSeleccionado = input.files && input.files.length > 0 ? input.files[0] : null;
      this.formularioDocumentacion.get('archivo')?.setValue(this.archivoSeleccionado ? this.archivoSeleccionado.name : '');
  }

  private getAllDocumentacionSistema(): void{
      this.manualesInformacionService.getAllDocumentacionSistema().subscribe({
          next: (response) => {
              this.documentacionSistema = response;
          },
          error: (error) => {
              this.sweet.alertaGeneral('error','Error', 'Error al obtener la documentación del sistema');
          }
      });
  }

  private inicializarFormulario(): FormGroup {
      return this.formBuilder.group({
          nombreDocumento: ['', Validators.required],
          tipoDocumento: ['', Validators.required],
          archivo: ['', Validators.required]
      });
  }

  validarFormulario(): void {
      if (this.formularioDocumentacion.invalid) {
          this.sweet.alertaCamposInvalidosFormularios();
          return Object.values(this.formularioDocumentacion.controls).forEach(control => {
              control.markAsTouched();
          });

      }else{
          let dataDocumentos = this.crearDataDocumentos();
          this.registrarDocumentacion(dataDocumentos);
      }
  }

  private crearDataDocumentos(): FormData {
      const formData = new FormData();
      formData.append('nombreDocumento', this.formularioDocumentacion.get('nombreDocumento')?.value);
      formData.append('tipoDocumento', this.formularioDocumentacion.get('tipoDocumento')?.value);
      if (this.archivoSeleccionado) {
          formData.append('archivo', this.archivoSeleccionado, this.archivoSeleccionado.name);
      }

      return formData;
  }

  private registrarDocumentacion(data: any): void {
      this.manualesInformacionService.registroDocumentacion(data).subscribe({
          next: (response) => {
              this.sweet.alertaGeneral('success','Registro realizado', 'Documentación registrada con éxito');
          },
          error: (error) => {
              this.sweet.alertaGeneral('error','Error', 'Error al registrar la documentación');
          }
      });
  }
}
