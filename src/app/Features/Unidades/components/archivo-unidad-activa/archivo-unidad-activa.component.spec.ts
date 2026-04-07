import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivoUnidadActivaComponent } from './archivo-unidad-activa.component';

describe('ArchivoUnidadActivaComponent', () => {
  let component: ArchivoUnidadActivaComponent;
  let fixture: ComponentFixture<ArchivoUnidadActivaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivoUnidadActivaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchivoUnidadActivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
