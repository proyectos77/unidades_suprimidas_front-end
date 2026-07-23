import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule, Router, NavigationEnd } from '@angular/router';
import { LoginService } from '../../../Auth/services/login.service';
import { NgIf } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, RouterLink, NgIf],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export default class SidebarComponent implements OnInit {

    public rolUser: string = '';
    public Permiso: number = 0;
    public expandedMenu: string | null = null;

    constructor(private httpLogin: LoginService, private router: Router) {

    }

    ngOnInit(): void {
        console.log(this.httpLogin.datosSesion());
        this.rolUser = this.httpLogin.datosSesion().idTipoUsuario;
        this.Permiso = this.httpLogin.datosSesion().permiso_id;
        console.log(this.Permiso);

        this.expandActivateMenu();

        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            this.expandActivateMenu();
        });
    }

    toggleMenu(menuName: string): void {
        this.expandedMenu = this.expandedMenu === menuName ? null : menuName;
    }

    expandActivateMenu(): void {
        const currentRoute = this.router.url;
        if (currentRoute.includes('unidadesActivas')) {
            this.expandedMenu = 'unidadesActivas';
        } else if (currentRoute.includes('transferencias')) {
            this.expandedMenu = 'transferencias';
        } else if (currentRoute.includes('estadisticas')) {
            this.expandedMenu = 'estadisticas';
        } else if (currentRoute.includes('organigrama')) {
            this.expandedMenu = 'organigrama';
        } else if (currentRoute.includes('unidades')) {
            this.expandedMenu = 'unidades';
        }
    }

    isMenuExpanded(menuName: string): boolean {
        return this.expandedMenu === menuName;
    }

}
