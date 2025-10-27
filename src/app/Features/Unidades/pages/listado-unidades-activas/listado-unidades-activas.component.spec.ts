import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoUnidadesActivasComponent } from './listado-unidades-activas.component';

describe('ListadoUnidadesActivasComponent', () => {
  let component: ListadoUnidadesActivasComponent;
  let fixture: ComponentFixture<ListadoUnidadesActivasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoUnidadesActivasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoUnidadesActivasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
