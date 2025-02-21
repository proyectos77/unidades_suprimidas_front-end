import { Routes } from '@angular/router';
import { authGuard } from './Core/guards/auth.guard';


export const routes: Routes = [
    { path: 'login', loadChildren: () => import('./Auth/login.routes') },

    {path: 'main', loadChildren: () => import('./Dashboard/appplication.routes'), canActivate: [authGuard]},

    /* { path: '**', redirectTo: 'login' }, */
    {path: '**', redirectTo: 'login', pathMatch:'full'}
];
