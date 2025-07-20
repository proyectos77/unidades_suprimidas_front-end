import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [

  {
    path: 'main/unidades/informacionUnidad/:id',
    renderMode: RenderMode.Server // O simplemente omite 'renderMode' para que use SSR dinámico
                                   // si esa es tu configuración por defecto.
                                   // RenderMode.Server es más explícito.
  },

  {
      path: 'main/unidades/listadoTransferenciasPorArchivo/:id',
      renderMode: RenderMode.Server
  },

  {
      path: 'main/transferencias/detalleSolicitud/:idSolicitudTransferencia',
      renderMode: RenderMode.Server
  },


  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];



