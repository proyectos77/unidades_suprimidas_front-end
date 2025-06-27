import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buscadorTransferenciaPorArchivo'
})
export class BuscadorTransferenciaPorArchivoPipe implements PipeTransform {

 transform(lista: any[], texto: string): any[] {
    if (!Array.isArray(lista)) return [];

    if (!texto || texto.trim() === '') return lista;

    // Convertimos el texto de búsqueda a minúsculas para una comparación sin distinción de mayúsculas/minúsculas.
    const textoBusqueda = texto.toLowerCase();

    return lista.filter(transfer => {
      // Nos aseguramos de que cada propiedad exista y la convertimos a string y a minúsculas antes de comparar.
      const id = transfer.id_transferencia ? transfer.id_transferencia.toString().toLowerCase() : '';
      const seccion = transfer.seccion_transferencia ? transfer.seccion_transferencia.toLowerCase() : '';
      const subserie = transfer.subserie_transferencia ? transfer.subserie_transferencia.toLowerCase() : '';

      return id.includes(textoBusqueda) ||
             seccion.includes(textoBusqueda) ||
             subserie.includes(textoBusqueda);
    });
  }

}
