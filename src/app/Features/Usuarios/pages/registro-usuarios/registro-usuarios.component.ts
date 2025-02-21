import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TiposUsuariosService } from '../../services/tipos-usuarios.service';
import { GetAllTiposUsuarios } from '../../interfaces/get-all-tipos-usuarios';
import { NgFor } from '@angular/common';
import { CargosService } from '../../services/cargos.service';
import { GetAllCargos } from '../../interfaces/get-all-cargos';
import { ValidadoresPersonalizados } from '../../../../Core/Validators/cunstom-validators';
import Swal from 'sweetalert2';
import { SweetAlertService } from '../../../../Core/services/sweet-alert.service';
import { error } from 'console';
import { StoreUsuarios } from '../../interfaces/store-usuarios';
import { UsuariosServicesService } from '../../services/usuarios-services.service';
import { exit } from 'process';


@Component({
  selector: 'app-registro-usuarios',
  imports: [RouterLink, NgFor, ReactiveFormsModule],
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
        private httpUsuarios: UsuariosServicesService
    ){}

    ngOnInit(): void {
        this.listadoTipoUsaurios();
        this.listarCargos();

        this.formulario = this.formularioRegistro();
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
            ...this.formulario.value
        }

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
    }


}
