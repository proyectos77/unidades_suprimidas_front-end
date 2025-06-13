import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buscadorListadoSolicitudes'
})
export class BuscadorListadoSolicitudesPipe implements PipeTransform {

  transform(lista: any[], texto: string): any[] {
      if (!Array.isArray(lista)) return [];

      if (!texto || texto.trim() === '') return lista;

      const textoNormalizado = this.normalizar(texto);

      return lista.filter(item =>
         this.normalizar(item.unidad).includes(textoNormalizado) ||
        this.normalizar(item.anio?.toString()).includes(textoNormalizado) ||
        this.normalizar(item.usuarioSolicita).includes(textoNormalizado) ||
        this.normalizar(item.fechaSolicitud).includes(textoNormalizado) ||
        this.normalizar(item.estadoSolicitud).includes(textoNormalizado)
      );
  }

  private normalizar(texto: string | undefined): string {
      return (texto || '')
        .toLowerCase()
        .normalize('NFD')                      // Descompone acentos
        .replace(/[\u0300-\u036f]/g, '')       // Elimina marcas de acento
        .replace(/\s+/g, ' ')                  // Reemplaza varios espacios por uno
        .trim();                               // Quita espacios de inicio/fin
  }

}
