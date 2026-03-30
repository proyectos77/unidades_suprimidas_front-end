import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVisualizacionComponent } from './modal-visualizacion.component';

describe('ModalVisualizacionComponent', () => {
  let component: ModalVisualizacionComponent;
  let fixture: ComponentFixture<ModalVisualizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalVisualizacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalVisualizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
