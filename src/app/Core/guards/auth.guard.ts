import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../../Auth/services/login.service';


export const authGuard: CanActivateFn = (route, state) => {
    const login = inject(LoginService);
    const router = inject(Router);

    if (!login.logueado()) {
        router.navigate(['login'], {queryParams: {returnUrl: state.url}})
        return false;
    }

    return true;
};
