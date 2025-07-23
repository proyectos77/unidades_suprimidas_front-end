import { Routes } from '@angular/router';

export const routes: Routes = [

    { path: 'solicitudTrasferencias', loadComponent: () =>  import('./pages/solicitud-de-transferencia/solicitud-de-transferencia.component')},
    { path: 'listadoSolicitudes', loadComponent: () =>  import('./pages/listado-solicitudes-transferencias/listado-solicitudes-transferencias.component')},
    { path: 'detalleSolicitud/:idSolicitudTransferencia', loadComponent: () =>  import('./pages/detalle-solicitu-transferencia/detalle-solicitu-transferencia.component')},
    { path: 'correccion/:idTransferencia', loadComponent: () =>  import('./pages/correccion-solicitud-transferencia/correccion-solicitud-transferencia.component')},
   /*  { path: 'listadoUnidades', loadComponent: () =>  import('./pages/listado-unidades/listado-unidades.component')},
    { path: 'registroUnidades', loadComponent: () =>  import('./pages/registro-unidades/registro-unidades.component')},
    { path: 'registroDetalleUnidad', loadComponent: () => import('./pages/registro-detalle-unidad/registro-detalle-unidad.component')},
    { path: 'informacionUnidad/:id', loadComponent: () => import('./pages/vista-detalle-unidad/vista-detalle-unidad.component')},
    { path: 'registroArchivoUnidad', loadComponent: () => import('./pages/registro-archivo-unidad/registro-archivo-unidad.component')}, */

    /* { path: 'registroUsuarios', loadComponent: () =>  import('./pages/registro-usuarios/registro-usuarios.component')},

     */
    {path: '', redirectTo: 'solicitudTrasferencias', pathMatch:'full'}

];

export default routes;
