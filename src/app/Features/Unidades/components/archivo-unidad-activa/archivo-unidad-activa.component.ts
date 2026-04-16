import { Component, Input } from '@angular/core';
import { FolderNiveles } from '../../interfaces/FolderNiveles';

@Component({
  selector: 'app-archivo-unidad-activa',
  standalone: true,
  imports: [ArchivoUnidadActivaComponent], // recursivo
  templateUrl: './archivo-unidad-activa.component.html',
  styleUrl: './archivo-unidad-activa.component.css'
})
export class ArchivoUnidadActivaComponent {

  @Input() folders: FolderNiveles[] = [];
  @Input() level: number = 0;

  toggle(folder: FolderNiveles) {
    // 🔥 cerrar hermanos
    this.folders.forEach(f => {
      if (f !== folder) {
        f.expanded = false;
      }
    });

    // toggle actual
    folder.expanded = !folder.expanded;
  }
}
