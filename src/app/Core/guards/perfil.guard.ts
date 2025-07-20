import { CanActivateChildFn, Router } from '@angular/router';
import { LoginService } from '../../Auth/services/login.service';
import { inject } from '@angular/core';


export const perfilGuard: CanActivateChildFn = (childRoute, state) => {
    const perfil = inject(LoginService);
    const router = inject(Router);


    if (perfil.datosSesion().idTipoUsuario == 1) {
        return true;
    }else{
        router.navigate(['login'], {queryParams: {returnUrl: state.url}})
        return false;
    }

};
