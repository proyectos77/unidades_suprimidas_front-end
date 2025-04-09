import { Routes } from '@angular/router';

export const routes: Routes = [

    { path: 'listadoUnidades', loadComponent: () =>  import('./pages/listado-unidades/listado-unidades.component')},
    { path: 'registroUnidades', loadComponent: () =>  import('./pages/registro-unidades/registro-unidades.component')},
    { path: 'registroDetalleUnidad', loadComponent: () => import('./pages/registro-detalle-unidad/registro-detalle-unidad.component')},
    { path: 'informacionUnidad/:id', loadComponent: () => import('./pages/vista-detalle-unidad/vista-detalle-unidad.component')},

    /* { path: 'registroUsuarios', loadComponent: () =>  import('./pages/registro-usuarios/registro-usuarios.component')},

     */
    {path: '', redirectTo: 'listadoUnidades', pathMatch:'full'}

];

export default routes;
