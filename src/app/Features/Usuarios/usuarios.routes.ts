import { Routes } from '@angular/router';

export const routes: Routes = [

    { path: '', loadComponent: () =>  import('./pages/liestado-usuarios/listado-usuarios.component')},

    { path: 'registroUsuarios', loadComponent: () =>  import('./pages/registro-usuarios/registro-usuarios.component')},



];

export default routes;
