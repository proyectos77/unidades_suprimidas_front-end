import { Routes } from '@angular/router';

export const routes: Routes = [

    { path: 'manuales', loadComponent: () =>  import('../ManualesInformacion/pages/vista-manuales/vista-manuales.component')},

    { path: 'informacion', loadComponent: () =>  import('../ManualesInformacion/pages/vista-informacion/vista-informacion.component')},

];

export default routes;
