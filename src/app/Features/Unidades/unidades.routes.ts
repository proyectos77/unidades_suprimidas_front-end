import { Routes } from '@angular/router';

export const routes: Routes = [

    { path: 'listadoUnidades', loadComponent: () =>  import('./pages/listado-unidades/listado-unidades.component')},

    /* { path: 'registroUsuarios', loadComponent: () =>  import('./pages/registro-usuarios/registro-usuarios.component')},

     */
    {path: '', redirectTo: 'listadoUnidades', pathMatch:'full'}

];

export default routes;
