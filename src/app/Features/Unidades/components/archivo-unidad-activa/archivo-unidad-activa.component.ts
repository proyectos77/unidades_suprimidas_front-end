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
  @Input() idUnidad: number = 0;
  @Input() onLoadEstantes: ((folder: FolderNiveles, idUnidad: number) => void) | null = null;
  @Input() onLoadBaldas: ((folder: FolderNiveles, idUnidad: number) => void) | null = null;
  @Input() onLoadCajas: ((folder: FolderNiveles, idUnidad: number) => void) | null = null;
  @Input() onLoadCarpetas: ((folder: FolderNiveles, idUnidad: number) => void) | null = null;
  @Input() onDescargarDocumentoCaja: ((folder: FolderNiveles, idUnidad: number) => void) | null = null;
  @Input() onVerDataDocumentoFuid: ((folder: FolderNiveles, idUnidad: number) => void) | null = null;

  descargarExcel(event: Event, folder: FolderNiveles) {
    event.stopPropagation();
    if (this.onDescargarDocumentoCaja) {
      this.onDescargarDocumentoCaja(folder, this.idUnidad);
    }
  }

  verDataDocumento(event: Event, folder: FolderNiveles) {
    event.stopPropagation();
    if (this.onVerDataDocumentoFuid) {
      this.onVerDataDocumentoFuid(folder, this.idUnidad);
    }
  }

  toggle(folder: FolderNiveles) {
    console.log(`Toggle level ${this.level}, folder:`, folder.name, `childrenLoaded: ${folder.childrenLoaded}`);

    // 🔥 cerrar hermanos
    this.folders.forEach(f => {
      if (f !== folder) {
        f.expanded = false;
      }
    });

    // toggle actual
    folder.expanded = !folder.expanded;
    console.log(`Folder expanded: ${folder.expanded}`);

    // Si se abre y no tiene children cargados, cargar según el nivel
    if (folder.expanded && !folder.childrenLoaded) {
      console.log(`Loading children for level ${this.level}`);
      if (this.level === 0 && this.onLoadEstantes) {
        console.log('Calling onLoadEstantes');
        this.onLoadEstantes(folder, this.idUnidad);
      } else if (this.level === 1 && this.onLoadBaldas) {
        console.log('Calling onLoadBaldas');
        this.onLoadBaldas(folder, this.idUnidad);
      } else if (this.level === 2 && this.onLoadCajas) {
        console.log('Calling onLoadCajas');
        this.onLoadCajas(folder, this.idUnidad);
      } else if (this.level === 3 && this.onLoadCarpetas) {
        console.log('Calling onLoadCarpetas');
        this.onLoadCarpetas(folder, this.idUnidad);
      } else {
        console.log('No load function available for level', this.level);
      }
    }

    // Si se cierra, cerrar todos los children recursivamente
    if (!folder.expanded) {
      this.cerrarTodosLosChildren(folder);
    }
  }

  private cerrarTodosLosChildren(folder: FolderNiveles) {
    if (folder.children && folder.children.length > 0) {
      folder.children.forEach(child => {
        child.expanded = false;
        this.cerrarTodosLosChildren(child);
      });
    }
  }
}
