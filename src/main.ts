import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from './app/Core/interceptors/http.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations'; // 1. Importar el proveedor

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withHashLocation()),
    provideAnimations(),
    provideHttpClient(withInterceptors([httpInterceptor])),

  ]
}).catch((err) => console.error(err));
