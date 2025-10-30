import { log } from 'console';
import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UnidadesService } from '../../../Unidades/services/unidades.service';

declare var bootstrap: any;

@Component({
  selector: 'app-organigrama-ejercito',
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './organigrama-ejercito.component.html',
  styleUrl: './organigrama-ejercito.component.css'
})
export default class OrganigramaEjercitoComponent implements OnInit {

  public padresUnidad: Array<{ opciones: any[]; seleccion: any }> = [];
  public padre: number = 0;
  public selectedUnidad: any = null; // unidad actualmente seleccionada en la rama
  // paleta de colores para los niveles (se aplican por índice)
  public levelColors: string[] = ['#0d6efd', '#6f42c1', '#198754', '#fd7e14', '#dc3545', '#20c997'];

  constructor(private httpUnidades: UnidadesService) { }

  ngOnInit(): void {
    this.listadoDependenciasPadre();
  }

  listadoDependenciasPadre(): void {
    this.httpUnidades.getListadoPadresUnidadesActivas().subscribe(unidadesPadre => {
      this.padresUnidad = [
        { opciones: unidadesPadre.data, seleccion: null }
      ];
      this.selectedUnidad = null;
    });
  }

  onSeleccionarDependencia(nivelIndex: number, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const idPadre: number = parseInt(selectElement.value, 10);
    this.seleccionarDependencia(nivelIndex, idPadre);
  }

  // Selección desde el Accordion o desde el select: idPadre y el objeto dep son opcionales
  seleccionarDependencia(nivelIndex: number, idPadre: number, dep?: any): void {
    this.padre = idPadre;

    // marcar selección en el nivel actual y truncar niveles siguientes
    this.padresUnidad[nivelIndex].seleccion = idPadre;
    this.padresUnidad = this.padresUnidad.slice(0, nivelIndex + 1);

    // asignar la unidad seleccionada para mostrar detalles
    if (dep) {
      this.selectedUnidad = dep;
    } else {
      const seleccion = this.padresUnidad[nivelIndex].opciones.find((d: any) => d.id_unidad === idPadre);
      this.selectedUnidad = seleccion || null;
    }

    // traer hijos del nivel seleccionado y, si existen, agregarlos como nuevo nivel
    this.httpUnidades.getListadoPadresHijasActivas(idPadre).subscribe(hijos => {
      if (hijos.data && hijos.data.length > 0) {
        this.padresUnidad.push({ opciones: hijos.data, seleccion: null });
      }
    });
  }

  nombreSeleccionNivel(nivelIndex: number): string {
    const nivel = this.padresUnidad[nivelIndex];
    if (!nivel) return '';
    const seleccionado = nivel.opciones.find((d: any) => d.id_unidad === nivel.seleccion);
    if (seleccionado) {
      const nombre = seleccionado.nombre_unidad || seleccionado.nombre || '';
      const sigla = seleccionado.sigla_unidad ? ` (${seleccionado.sigla_unidad})` : '';
      return `${nombre}${sigla}`;
    }
    return 'Seleccione Unidad';
  }

  colorSeleccionNivel(nivelIndex: number): string | null {
    const nivel = this.padresUnidad[nivelIndex];
    if (!nivel || !nivel.seleccion) return null;
    const color = this.levelColors[nivelIndex % this.levelColors.length];
    return color;
  }

  cerrarNivel(nivelIndex: number): void {
    const id = `collapse${nivelIndex}`;
    const el = document.getElementById(id);
    if (!el) return;
    let inst = bootstrap.Collapse.getInstance(el);
    if (!inst) {
      inst = new bootstrap.Collapse(el, { toggle: false });
    }
    inst.hide();
  }

  resetAll(): void {
    this.padre = 0;
    this.selectedUnidad = null;
    this.padresUnidad = [];
    this.listadoDependenciasPadre();
  }

}
