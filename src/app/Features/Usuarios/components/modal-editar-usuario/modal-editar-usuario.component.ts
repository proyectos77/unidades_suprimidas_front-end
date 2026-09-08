
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild, Output, EventEmitter} from '@angular/core';
import { DatumUsuario } from '../../interfaces/get-all-usuarios';
import { CargosService } from '../../services/cargos.service';
import { GetAllCargos } from '../../interfaces/get-all-cargos';
import { NgFor } from '@angular/common';
import { TiposUsuariosService } from '../../services/tipos-usuarios.service';
import { GetAllTiposUsuarios } from '../../interfaces/get-all-tipos-usuarios';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidadoresPersonalizados } from '../../../../Shared/Validators/cunstom-validators';
import { SweetAlertService } from '../../../../Core/services/sweet-alert.service';
import { StoreUsuarios } from '../../interfaces/store-usuarios';
import { UsuariosServicesService } from '../../services/usuarios-services.service';
import { PermisosService } from '../../services/permisos.service';
import { ListadoPermisos } from '../../interfaces/listado-permisos';
import { NgSelectModule } from '@ng-select/ng-select';



@Component({
  selector: 'app-modal-editar-usuario',
  imports: [NgFor, ReactiveFormsModule, NgSelectModule],
  templateUrl: './modal-editar-usuario.component.html',
  styleUrl: './modal-editar-usuario.component.css',

})
export class ModalEditarUsuarioComponent implements OnInit {  // Implementar OnChanges

    @ViewChild('cerrarModal') cerrarModal!: ElementRef;

    @Input() usuario!: DatumUsuario;
    @Output() usuarioEditado: EventEmitter<void> = new EventEmitter();

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

    public listadoPermisosData: ListadoPermisos = {
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
        private sweet: SweetAlertService,
        private httUsuario: UsuariosServicesService,
        private httpPermisos: PermisosService,

    ){}

    ngOnInit(): void {
        this.listadoCargos();
        this.listaTipoUsuario();
        this.listadoPermisos();
        this.formularioEdit = this.formularioEditUsaurio();

        this.formularioEdit.get('nombre')?.valueChanges.subscribe(valor => {
            if (valor) {
                this.formularioEdit.patchValue({ nombre: valor.toUpperCase() }, { emitEvent: false });
            }
        });

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

    listadoPermisos():void{
        this.httpPermisos.listadoPermisos().subscribe(permisos => {
            if (permisos.statusCode == 200) {
                this.listadoPermisosData = permisos;
            }
        });
    }

    formularioEditUsaurio():FormGroup{
        return this.form.group({
            'nombre': ['', [Validators.required, ValidadoresPersonalizados.validarSoloLetras]],
            'identificacion': ['', [Validators.required, ValidadoresPersonalizados.validarSoloNumeros]],
            'user': ['', [Validators.required]],
            'emailUsuario': ['', [Validators.required, Validators.email]],
            'cargo': ['', [Validators.required]],
            'tipoUsuario': ['', [Validators.required]],
            'permiso': [[], [Validators.required]]
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['usuario'] && this.usuario && this.usuario.id != 0) {
            this.cargarDatosFormulario(this.usuario);
        }
    }

    cargarDatosFormulario(usuario: DatumUsuario) {
        this.formularioEdit.patchValue({
          'nombre': usuario.nombre,
          'identificacion': usuario.identificacion,
          'user': usuario.usuario,
          'emailUsuario': usuario.email,
          'cargo': usuario.idCargo ,
          'tipoUsuario': usuario.idTipoUsuario,
          'permiso': (usuario.permisos ?? []).map(permiso => permiso.id)
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
        this.httUsuario.updateUsuarios(data, this.usuario.id).subscribe(updateUsuario => {
            if (updateUsuario.statusCode == 200) {
                this.cerrarModales();
            }
            this.sweet.alertaGeneral(updateUsuario.icono, updateUsuario.titulo, updateUsuario.mensaje);
        });
    }

    cerrarModales() {
        this.cerrarModal.nativeElement.click();
        this.usuarioEditado.emit();
    }
}
