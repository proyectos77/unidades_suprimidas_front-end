import { Component, OnInit, ViewChild, ElementRef, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SweetAlertService } from '../../../Core/services/sweet-alert.service';
import { SetLogin } from '../../interfaces/set-login';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent implements OnInit{

    public loginForm!: FormGroup;
    public captchaCode: string = '';
    private platformId = inject(PLATFORM_ID);
    private captchaIntervalId: any;

    @ViewChild('codigoCaptcha') captchaInput!: ElementRef<HTMLInputElement>;

    constructor(
        private formBuilder: FormBuilder,
        private sweet: SweetAlertService,
        private httpLogin: LoginService,
        private router: Router
    ){}

    ngOnInit(): void {
        this.loginForm = this.formularioSesion();
        this.cerrarSessiones();
        if (isPlatformBrowser(this.platformId)) {
            this.cargarCaptcha();
            this.captchaIntervalId = setInterval(() => {
                this.cargarCaptcha();
            }, 2 * 60 * 1000); // 2 minutos
        }
    }
    ngOnDestroy(): void {
        if (this.captchaIntervalId) {
            clearInterval(this.captchaIntervalId);
        }
    }

    formularioSesion():FormGroup{
        return this.formBuilder.group({
            user_usuario: ['', [Validators.required]],
            password_usuario: ['', [Validators.required]],
            captcha: ['', [Validators.required]]
        })
    }

    validarForm():void{
        if (this.loginForm.invalid) {
            this.sweet.alertaGeneral('error', 'Error', 'Por favor completa todos los campos requeridos');
            return Object.values(this.loginForm.controls).forEach(controls =>{
                controls.markAllAsTouched();
            });
        }else{
            const captchaIngresado = this.loginForm.get('captcha')?.value;

            if (captchaIngresado !== this.captchaCode) {
                this.sweet.alertaGeneral('error', 'Error', 'El código de seguridad es incorrecto');
                this.loginForm.get('captcha')?.reset();
                return;
            }

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
                this.sweet.alertaLogin2();
                setTimeout(() => {
                    this.router.navigateByUrl('/main');
                }, 1500);

                /* window.location.reload(); */
            }else{
                this.sweet.alertaGeneral('error', 'Error', login.mensaje);
            }

        });
    }

    cerrarSessiones(): void {
        if (this.httpLogin.getToken()) {
            this.httpLogin.limpiarSesion();
        }
    }

    cargarCaptcha(): void {
        this.httpLogin.getCaptcha().subscribe(captcha => {
            this.captchaCode = captcha.captcha;
            this.loginForm.get('captcha')?.reset();
        });
    }


}
