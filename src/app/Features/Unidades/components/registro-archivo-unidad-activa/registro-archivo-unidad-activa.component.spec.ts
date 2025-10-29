import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroArchivoUnidadActivaComponent } from './registro-archivo-unidad-activa.component';

describe('RegistroArchivoUnidadActivaComponent', () => {
  let component: RegistroArchivoUnidadActivaComponent;
  let fixture: ComponentFixture<RegistroArchivoUnidadActivaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroArchivoUnidadActivaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroArchivoUnidadActivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
