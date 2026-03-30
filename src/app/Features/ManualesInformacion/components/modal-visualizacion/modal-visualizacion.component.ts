import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgIf } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-modal-visualizacion',
  imports: [NgIf],
  templateUrl: './modal-visualizacion.component.html',
  styleUrl: './modal-visualizacion.component.css'
})
export default class ModalVisualizacionComponent implements OnChanges {

  @Input() tipoContenido: string = '';
  @Input() urlContenido: string = '';

  public urlDocumentoModal!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {

    if (!this.urlContenido) return;

    // 🔥 CODIFICAR RUTA (CLAVE PARA DOCUMENTS Y MANUALES)
    const rutaCodificada = this.urlContenido
      .split('/')
      .map(segmento => encodeURIComponent(segmento))
      .join('/');

    // 🔥 URL FINAL (DINÁMICA)
    const url = `http://172.22.3.102/api/documentos/${rutaCodificada}`;

    console.log('URL generada:', url);

    // 🔥 SANITIZER (OBLIGATORIO)
    this.urlDocumentoModal =
      this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
