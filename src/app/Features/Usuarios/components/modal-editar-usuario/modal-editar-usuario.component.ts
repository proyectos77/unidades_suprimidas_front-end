import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, Input, OnInit, SimpleChanges} from '@angular/core';
import { DatumUsuario } from '../../interfaces/get-all-usuarios';
import { CargosService } from '../../services/cargos.service';
import { GetAllCargos } from '../../interfaces/get-all-cargos';
import { NgFor } from '@angular/common';
import { TiposUsuariosService } from '../../services/tipos-usuarios.service';
import { GetAllTiposUsuarios } from '../../interfaces/get-all-tipos-usuarios';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidadoresPersonalizados } from '../../../../Core/Validators/cunstom-validators';
import { log } from 'console';
import { SweetAlertService } from '../../../../Core/services/sweet-alert.service';
import { StoreUsuarios } from '../../interfaces/store-usuarios';

@Component({
  selector: 'app-modal-editar-usuario',
  imports: [NgFor, ReactiveFormsModule],
  templateUrl: './modal-editar-usuario.component.html',
  styleUrl: './modal-editar-usuario.component.css',

})
export class ModalEditarUsuarioComponent implements OnInit {  // Implementar OnChanges

    @Input() usuario!: DatumUsuario;
    public cargos: GetAllCargos = {
        'statusCode': 0,
        'titulo': '',
        'mensaje': '',
        'icono': '',
        'data': []
    }

    public tipoUsuarios: GetAllTiposUsuarios = {
        'statusCode': 0,
        'titulo': '',
        'mensaje': '',
        'icono': '',
        'data': []
    }

    public formularioEdit!: FormGroup;

    constructor(
        private httpCargos: CargosService,
        private httpTipoUsuario: TiposUsuariosService,
        private form: FormBuilder,
        private sweet: SweetAlertService
    ){}

    ngOnInit(): void {
        this.listadoCargos();
        this.listaTipoUsuario();
        this.formularioEdit = this.formularioEditUsaurio();

    }

    listadoCargos():void{
        this.httpCargos.listaCargos().subscribe(cargos => {
            this.cargos = cargos;
        })
    }

    listaTipoUsuario():void{
        this.httpTipoUsuario.listadoTipoUsuarios().subscribe(tipoUsuarios => {
            this.tipoUsuarios = tipoUsuarios;
        });
    }

    formularioEditUsaurio():FormGroup{
        return this.form.group({
            'nombre': ['', [Validators.required, ValidadoresPersonalizados.validarSoloLetras]],
            'identificacion': ['', [Validators.required, ValidadoresPersonalizados.validarSoloNumeros]],
            'user': ['', [Validators.required]],
            'emailUsuario': ['', [Validators.required, Validators.email]],
            'cargo': ['', [Validators.required]],
            'tipoUsuario': ['', [Validators.required]]
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['usuario'] && this.usuario && this.usuario.id != 0) {
            this.cargarDatosFormulario(this.usuario);
        }
    }

    cargarDatosFormulario(usuario: DatumUsuario) {
        console.log(usuario);

        this.formularioEdit.patchValue({
          'nombre': usuario.nombre,
          'identificacion': usuario.identificacion,
          'user': usuario.usuario,
          'emailUsuario': usuario.email,
          'cargo': usuario.idCargo ,
          'tipoUsuario': usuario.idTipoUsuario
        });
    }

    validarFormulario():void{
        if (this.formularioEdit.invalid) {
            this.sweet.alertaGeneral('error', 'Error', 'Porfavor llenar los campos obligatorios');
            return Object.values(this.formularioEdit.controls).forEach(controls => {
                controls.markAllAsTouched();
            });
        }else{
            let dataForm = this.crearDataFormulario();
            this.editarUsuario(dataForm);
        }
    }

    crearDataFormulario():StoreUsuarios{
        const data: StoreUsuarios = {
            ...this.formularioEdit.value
        }
        return data;
    }

    editarUsuario(data: StoreUsuarios):void{
        
    }
}
