// folder-niveles.interface.ts
export interface FolderNiveles {
  name: string;
  expanded?: boolean;
  children: FolderNiveles[];
  // Nivel 0 y 1 (BALDA / Cajas)
  cajas?: number;
  carpetas?: number;
  folios?: number;
  bodega?: string;
  consecutivoBodega?: string;
  correlativoDependencia?: string;
  cantidadSeries?: number;
  cantidadProcesos?: number;
  anios?: string;
  // Nivel 2 (Carpetas)
  numeroCarpeta?: string;
  nombreExpediente?: string;
  fechasExtremas?: string;
  folioPorCarpeta?: number;
  serie?: string;
  subseries?: string[];
}
