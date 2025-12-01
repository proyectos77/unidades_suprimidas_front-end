import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroAnioArchivoUnidadActivaComponent } from './registro-anio-archivo-unidad-activa.component';

describe('RegistroAnioArchivoUnidadActivaComponent', () => {
  let component: RegistroAnioArchivoUnidadActivaComponent;
  let fixture: ComponentFixture<RegistroAnioArchivoUnidadActivaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroAnioArchivoUnidadActivaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroAnioArchivoUnidadActivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
