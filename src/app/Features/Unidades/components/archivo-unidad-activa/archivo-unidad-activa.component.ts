import { Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FolderNiveles } from '../../interfaces/FolderNiveles';

@Component({
  selector: 'app-archivo-unidad-activa',
  standalone: true,
  imports: [NgFor, NgIf, ArchivoUnidadActivaComponent], // 🔥 recursivo
  templateUrl: './archivo-unidad-activa.component.html',
  styleUrl: './archivo-unidad-activa.component.css'
})
export class ArchivoUnidadActivaComponent {

  @Input() folders: FolderNiveles[] = [];

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
