import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { validateHeaderName } from "http";


export class ValidadoresPersonalizados extends Validators {

    /* static validadorPass(control: AbstractControl):ValidationErrors | null{
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        return regex.test(control.value) ? null : {validadorPass: true};
    }

    static validarPassIguales(pass1: string, pass2: string): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const pass1Control = control.get(pass1);
            const pass2Control = control.get(pass2);

            if (!pass1Control || !pass2Control) {
                return null;
            }

            return pass1Control.value === pass2Control.value ? null : { validarPassIguales: true };
        };
    } */

    static validarSoloNumeros(control: AbstractControl):ValidationErrors | null{
        const regex = /^\d+$/;
        return regex.test(control.value) ? null : {validarSoloNumeros: true}
    }

    static validarSoloLetras(control: AbstractControl):ValidationErrors | null{
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        return regex.test(control.value) ? null : {validarSoloLetras: true}
    }
}
