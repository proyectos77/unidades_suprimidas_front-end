import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buscadorListadoUnidades'
})
export class BuscadorListadoUnidadesPipe implements PipeTransform {

  transform(lista: any[], texto: string): any[] {
      if (!Array.isArray(lista)) return [];

      if (!texto || texto.trim() === '') return lista;

      texto = texto.toLowerCase();

      return lista.filter(unidad =>
          unidad.nombre.toLowerCase().includes(texto) ||
          unidad.sigla.toLowerCase().includes(texto) ||
          unidad.unidad_que_asume_archivo_unidad.toLowerCase().includes(texto) ||
          unidad.departamento.toLowerCase().includes(texto) ||
          unidad.municipio.toLowerCase().includes(texto)
      );
  }

}
