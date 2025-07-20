import { Routes } from '@angular/router';
import { perfilGuard } from '../Core/guards/perfil.guard';

export const routes: Routes = [

    {
        path: 'unidades', loadComponent:() => import('./layout/main/main.component'),
        loadChildren: () => import('../Features/Unidades/unidades.routes')
    },

    {
        path: 'usuarios', loadComponent:() => import('./layout/main/main.component'),
        loadChildren: () => import('../Features/Usuarios/usuarios.routes'), canActivateChild: [perfilGuard]
    },

    {
        path: 'transferencias', loadComponent:() => import('./layout/main/main.component'),
        loadChildren: () => import('../Features/Transferencias/transferencias.routes')
    },


    {path: '', redirectTo: 'unidades', pathMatch:'full'}

];

export default routes;
