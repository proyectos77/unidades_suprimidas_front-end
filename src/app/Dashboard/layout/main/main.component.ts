import { Component, OnInit } from '@angular/core';
import HeaderComponent from "../header/header.component";
import SidebarComponent from "../sidebar/sidebar.component";
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from "../../../Shared/components/loader/loader.component";

@Component({
  selector: 'app-main',
  imports: [HeaderComponent, SidebarComponent, RouterOutlet, LoaderComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export default class MainComponent implements OnInit{
    public loading = true;

    ngOnInit(): void {

        this.cerrarSpiner();
    }

    cerrarSpiner():void{
        setTimeout (() =>{
            this.loading = false;
        }, 1000)
    }
    /* recargarPagina() {
      this.loading = true;
      setTimeout(() => {
          window.location.reload();
      }, 1000); // Da un pequeño tiempo para ver la animación
    } */
}



