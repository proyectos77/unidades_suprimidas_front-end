import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject, OnInit } from '@angular/core';
import { TiposUsuariosService } from '../../services/tipos-usuarios.service';
import { GetAllTiposUsuarios } from '../../interfaces/get-all-tipos-usuarios';
import { NgFor } from '@angular/common';
import { CargosService } from '../../services/cargos.service';
import { GetAllCargos } from '../../interfaces/get-all-cargos';
import { ValidadoresPersonalizados } from '../../../../Shared/Validators/cunstom-validators';
import { SweetAlertService } from '../../../../Core/services/sweet-alert.service';
import { StoreUsuarios } from '../../interfaces/store-usuarios';
import { UsuariosServicesService } from '../../services/usuarios-services.service';
import { DependenciaServiceService } from '../../services/dependencia-service.service';


@Component({
  selector: 'app-registro-usuarios',
  imports: [NgFor, ReactiveFormsModule],
  templateUrl: './registro-usuarios.component.html',
  styleUrl: './registro-usuarios.component.css'
})
export default class RegistroUsuariosComponent implements OnInit{
    datapantalla: string = 'Registro usuarios';

    public tipoUsuario: GetAllTiposUsuarios = {
        'statusCode': 0,
        'titulo': '',
        'mensaje': '',
        'icono': '',
        'data': []
    }

    public cargos: GetAllCargos = {
        'statusCode': 0,
        'titulo': '',
        'mensaje': '',
        'icono': '',
        'data': []
    }

    readonly #form = inject(FormBuilder);
    public formulario!: FormGroup;

    constructor(
        private httpTipoUsuarios: TiposUsuariosService,
        private httpCargos : CargosService,
        private sweet: SweetAlertService,
        private httpUsuarios: UsuariosServicesService,
        private httpDependencias: DependenciaServiceService
    ){}

    public nivelesDependencias: Array<{ opciones: any[]; seleccion: any }> = [];

    ngOnInit(): void {
        this.listadoTipoUsaurios();
        this.listarCargos();
        this.listadoDependenciasPadre();
        this.formulario = this.formularioRegistro();

        this.formulario.get('nombre')?.valueChanges.subscribe(valor => {
            if (valor) {
                this.formulario.patchValue({ nombre: valor.toUpperCase() }, { emitEvent: false });
            }
        });


    }

    formularioRegistro():FormGroup{
        return this.#form.group({
            nombre: ['', [Validators.required, ValidadoresPersonalizados.validarSoloLetras]],
            identificacion: ['', [Validators.required, ValidadoresPersonalizados.validarSoloNumeros]],
            user: ['', [Validators.required]],
            emailUsuario: ['', [Validators.required, Validators.email]],
            tipoUsuario: ['', [Validators.required]],
            cargo: ['', [Validators.required]]
        });
    }

    listadoTipoUsaurios():void{
        this.httpTipoUsuarios.listadoTipoUsuarios().subscribe(tipoUsuarios => {
            if (tipoUsuarios.statusCode == 200) {
                this.tipoUsuario = tipoUsuarios
            }
        });
    }

    listarCargos():void{
        this.httpCargos.listaCargos().subscribe(cargos => {
            if (cargos.statusCode == 200) {
                this.cargos = cargos;
            }
        });
    }

    listadoDependenciasPadre():void{
        this.httpDependencias.getListadoUnidadesPadres().subscribe(dependencias => {
            this.nivelesDependencias = [
                { opciones: dependencias.data, seleccion: null }
            ];
        });
    }

    onSeleccionarDependencia(nivelIndex: number, event: Event): void {
        const selectElement = event.target as HTMLSelectElement;
        const idPadre: number = parseInt(selectElement.value, 10);
        console.log(idPadre);


        // Actualiza la selección del nivel actual
        this.nivelesDependencias[nivelIndex].seleccion = idPadre;

        // Elimina niveles inferiores si existen
        this.nivelesDependencias = this.nivelesDependencias.slice(0, nivelIndex + 1);

        // Aquí deberías consultar los hijos por idPadre
        // Simulación: si el endpoint estuviera disponible, se haría algo como:
         this.httpDependencias.getListadoUnidadesHijas(idPadre).subscribe(hijos => {
             if (hijos.data && hijos.data.length > 0) {
                 this.nivelesDependencias.push({ opciones: hijos.data, seleccion: null });
             }
         });
        // Por ahora, solo estructura para cuando esté disponible


    }



    validarFormulario():void{
        if (this.formulario.invalid) {
            this.sweet.alertaGeneral('error', 'Error', 'Porfavor llenar los campos obligatorios');

            return Object.values(this.formulario.controls).forEach(controls => {
                controls.markAllAsTouched();
            })
        }else{

            let dataForm = this.crearDataFormulario();
            this.crearUsuario(dataForm);

        }
    }

    crearDataFormulario():StoreUsuarios{
        const data: StoreUsuarios = {
            ...this.formulario.value,
            dependencia: this.nivelesDependencias.length > 0 ? this.nivelesDependencias[this.nivelesDependencias.length - 1].seleccion : null
        };

        return data;
    }

    crearUsuario(data: StoreUsuarios):void{
        this.httpUsuarios.registrarUsuario(data).subscribe(usuario => {

            this.sweet.alertaGeneral(usuario.icono, usuario.titulo, usuario.mensaje);
            if (usuario.statusCode == 200) {
                this.limpiar();
            }
        })
    }

    limpiar(): void {
        this.formulario.reset();
        this.nivelesDependencias = [];
        this.formulario.get('tipoUsuario')?.setValue('');
        this.formulario.get('cargo')?.setValue('');
        this.listadoDependenciasPadre();
    }


}
