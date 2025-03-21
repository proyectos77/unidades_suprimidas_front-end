import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DepartamentosService } from '../../../../Core/services/departamentos.service';
import { GetAllDepartamentos } from '../../../../Core/interfaces/get-all-departamentos';
import { NgFor } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SweetAlertService } from '../../../../Core/services/sweet-alert.service';

@Component({
  selector: 'app-registro-unidades',
  imports: [NgFor, ReactiveFormsModule],
  templateUrl: './registro-unidades.component.html',
  styleUrl: './registro-unidades.component.css'
})
export default class RegistroUnidadesComponent implements OnInit{

    public formularioUnidad!: FormGroup;

    constructor(
        private httDepartamentos: DepartamentosService,
        private form: FormBuilder,
        private seet: SweetAlertService
    ) {}

    public departamentos:GetAllDepartamentos = {
        'icono': '',
        'mensaje': '',
        'statusCode': 0,
        'titulo': '',
        'data': []

    };

    ngOnInit(): void {
        this.listadoDepartamentos();
        this.formularioUnidad = this.formularioUnidades();
    }

    formularioUnidades():FormGroup{
        return this.form.group({
            nombre: ['', [Validators.required]],
            sigla: ['', [Validators.required]],
            padreUnidad: ['', [Validators.required]],
            departamentos: ['', [Validators.required]],
            municipios: ['', [Validators.required]]
        });
    }

    listadoDepartamentos():void{
        this.httDepartamentos.getAllDepartamentos().subscribe(departamentos =>{
            if (departamentos.statusCode == 200 && departamentos.data.length > 0) {
                this.departamentos.data = departamentos.data;
            }
        });
    }

    validarFormulario():void{
        if (this.formularioUnidad.invalid) {
            this.seet.alertaCamposInvalidosFormularios();

            return Object.values(this.formularioUnidad.controls).forEach(controlls =>{
                controlls.markAllAsTouched();
            });
        }else{

        }
    }

    crearDataFormulario():

}
