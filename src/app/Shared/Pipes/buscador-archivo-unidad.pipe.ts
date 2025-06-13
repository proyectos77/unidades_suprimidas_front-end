import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buscadorArchivoUnidad'
})
export class BuscadorArchivoUnidadPipe implements PipeTransform {

  transform(lista: any[], texto: string): any[] {
      if (!Array.isArray(lista)) return [];

      if (!texto || texto.trim() === '') return lista;

      return lista.filter(unidad =>
          unidad.anio_registro_archivo.includes(texto)
      );
  }

}
