import { Routes } from '@angular/router';

export const routes: Routes = [

    { path: 'organigramaEjercito', loadComponent: () =>  import('./Pages/organigrama-ejercito/organigrama-ejercito.component')},

];

export default routes;
