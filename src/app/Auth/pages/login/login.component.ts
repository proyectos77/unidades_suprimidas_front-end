import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SweetAlertService } from '../../../Core/services/sweet-alert.service';
import { SetLogin } from '../../interfaces/set-login';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { log } from 'console';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent implements OnInit{

    public loginForm!: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private sweet: SweetAlertService,
        private httpLogin: LoginService,
        private router: Router
    ){}

    ngOnInit(): void {
        this.loginForm = this.formularioSesion();
        this.cerrarSessiones();
    }

    formularioSesion():FormGroup{
        return this.formBuilder.group({
            user_usuario: ['', [Validators.required]],
            password_usuario: ['', [Validators.required]]
        })
    }

    validarForm():void{
        if (this.loginForm.invalid) {
            this.sweet.alertaGeneral('error', 'Error', 'Ingrese el usuario y la contraseña');
            return Object.values(this.loginForm.controls).forEach(controls =>{
                controls.markAllAsTouched();
            });
        }else{
            let dataFormulario = this.crearDataForm();
            this.iniciarSesion(dataFormulario);

        }
    }

    crearDataForm():SetLogin{
        return {
          ...this.loginForm.value
        }
    }

    iniciarSesion(data: SetLogin):void{
        this.httpLogin.login(data).subscribe(login  => {
            if (login.accessToken) {
                /* this.sweet.alertaLogin(login.mensaje); */

                this.router.navigateByUrl('/main');
                /* window.location.reload(); */

            }

        });
    }

    cerrarSessiones(): void {
        this.httpLogin.limpiarSesion();
    }


}
