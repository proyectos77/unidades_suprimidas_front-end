import { Routes } from '@angular/router';

export const routes: Routes = [

    {path: '', redirectTo: 'estadisticasReportes', pathMatch:'full'},
    { path: 'estadisticasReportes', loadComponent: () =>  import('../Estadisticas/pages/estadisticas/estadisticas.component')},



];

export default routes;
