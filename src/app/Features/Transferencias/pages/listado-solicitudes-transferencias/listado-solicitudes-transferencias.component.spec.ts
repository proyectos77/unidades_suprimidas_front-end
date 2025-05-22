import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoSolicitudesTransferenciasComponent } from './listado-solicitudes-transferencias.component';

describe('ListadoSolicitudesTransferenciasComponent', () => {
  let component: ListadoSolicitudesTransferenciasComponent;
  let fixture: ComponentFixture<ListadoSolicitudesTransferenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoSolicitudesTransferenciasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoSolicitudesTransferenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
