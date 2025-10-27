import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'buscadorListadoUnidadesActivas'
})
export class BuscadorListadoUnidadesActivasPipe implements PipeTransform {

  transform(lista: any[], texto: string): any[] {
    if (!Array.isArray(lista)) return [];
    if (!texto || texto.trim() === '') return lista;

    const term = texto.toLowerCase().trim();

    return lista.filter(unidad => {
      const nombre = unidad.nombre?.toLowerCase() || '';
      const sigla = unidad.sigla?.toLowerCase() || '';
      const padre = unidad.padre_unidad?.nombre_unidad?.toLowerCase() || '';
      const departamento = (unidad.departamento as string)?.toLowerCase() || '';
      const municipio = (unidad.municipio as string)?.toLowerCase() || '';
      const estado = unidad.estado?.toLowerCase() || '';

      return (
        nombre.includes(term) ||
        sigla.includes(term) ||
        padre.includes(term) ||
        departamento.includes(term) ||
        municipio.includes(term) ||
        estado.includes(term)
      );
    });
  }

}
