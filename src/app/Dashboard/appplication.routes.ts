import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: '', loadComponent:() => import('./layout/main/main.component'),
        loadChildren: () => import('../Features/Usuarios/usuarios.routes')
    }

];

export default routes;
