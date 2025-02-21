import { Component, input } from '@angular/core';
import { NavigationEnd, RouterModule, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export  class AppComponent {
  title = 'unidades_suprimidas ';
}
