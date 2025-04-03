import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroDetalleUnidadComponent } from './registro-detalle-unidad.component';

describe('RegistroDetalleUnidadComponent', () => {
  let component: RegistroDetalleUnidadComponent;
  let fixture: ComponentFixture<RegistroDetalleUnidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroDetalleUnidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroDetalleUnidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
