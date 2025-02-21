import { Component } from '@angular/core';
import { LoginService } from '../../../Auth/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export default class HeaderComponent {

  constructor(private httpAuth: LoginService, private router: Router){}

  cerrarSesion():void{
      this.httpAuth.cerrarSesion().subscribe(cierre =>{});
  }
}
