import { Component, OnInit } from '@angular/core';
import { DepartamentosService } from '../../../../Core/services/departamentos.service';
import { GetAllDepartamentos } from '../../../../Core/interfaces/get-all-departamentos';
import { NgFor } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SweetAlertService } from '../../../../Core/services/sweet-alert.service';
import { StoreUnidades } from '../../interfaces/store-unidades';
import { MunicipiosService } from '../../../../Core/services/municipios.service';
import { GetAllMunicipiosPorDepartamento } from '../../../../Core/interfaces/get-all-municipios-por-departamento';
import { UnidadesService } from '../../services/unidades.service';


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
        private sweet: SweetAlertService,
        private httMunicipios: MunicipiosService,
        private httUnidades: UnidadesService
    ) {}

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

    ngOnInit(): void {
        this.listadoDepartamentos();
        this.formularioUnidad = this.formularioUnidades();
        this.formularioUnidad.get('departamentos')?.valueChanges.subscribe(idDepartamento => {
            this.listarMunicipios(idDepartamento);
        });
    }

    formularioUnidades():FormGroup{
        return this.form.group({
            nombre: ['', [Validators.required]],
            division: ['', [Validators.required]],
            sigla: ['', [Validators.required]],
            unidad_que_asume: ['', [Validators.required]],
            departamentos: ['', [Validators.required]],
            idMunicipio: ['', [Validators.required]],
            estado:[false, [Validators.required]]
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

    validarFormulario():void{
        if (this.formularioUnidad.invalid) {
            this.sweet.alertaCamposInvalidosFormularios();

            return Object.values(this.formularioUnidad.controls).forEach(controlls =>{
                controlls.markAllAsTouched();
            });
        }else{
            let dataForm = this.crearDataFormulario();
            this.registrarUnidad(dataForm);
        }
    }

    crearDataFormulario():StoreUnidades{
        const data = {
            ...this.formularioUnidad.value
        }

        return data;
    }

    registrarUnidad(data: StoreUnidades):void{
        this.httUnidades.storeUnidad(data).subscribe(unidad =>{
            this.sweet.alertaGeneral(unidad.icono, unidad.titulo, unidad.mensaje);

            if (unidad.statusCode == 200) {
                this.limpiarForm();
            }
        })
    }

    limpiarForm(){
        this.formularioUnidad.reset();
        this.formularioUnidad.get('departamentos')?.setValue('');
        this.formularioUnidad.get('idMunicipio')?.setValue('');
    }

}
