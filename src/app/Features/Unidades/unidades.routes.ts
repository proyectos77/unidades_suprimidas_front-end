import { Routes } from '@angular/router';

export const routes: Routes = [

    { path: 'listadoUnidades', loadComponent: () =>  import('./pages/listado-unidades/listado-unidades.component')},
    { path: 'registroUnidades', loadComponent: () =>  import('./pages/registro-unidades/registro-unidades.component')},
    { path: 'registroDetalleUnidad', loadComponent: () => import('./pages/registro-detalle-unidad/registro-detalle-unidad.component')},
    { path: 'informacionUnidad/:id', loadComponent: () => import('./pages/vista-detalle-unidad/vista-detalle-unidad.component')},
    { path: 'registroArchivoUnidad', loadComponent: () => import('./pages/registro-archivo-unidad/registro-archivo-unidad.component')},

    { path: 'listadoTransferenciasPorArchivo/:id', loadComponent: () => import('./pages/listado-transferencias-archivo/listado-transferencias-archivo.component')},

    { path: 'unidadesActivas', loadComponent: () => import('./pages/listado-unidades-activas/listado-unidades-activas.component') },

    { path: 'registroArchivoUnidadesActivas/:id', loadComponent: () => import('./pages/registro-archivo-unidad-activa/registro-archivo-unidad-activa.component') },



    /* { path: 'registroUsuarios', loadComponent: () =>  import('./pages/registro-usuarios/registro-usuarios.component')},

     */
    {path: '', redirectTo: 'listadoUnidades', pathMatch:'full'}

];

export default routes;
