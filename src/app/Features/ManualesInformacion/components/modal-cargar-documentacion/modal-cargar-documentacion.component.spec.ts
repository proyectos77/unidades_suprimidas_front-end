import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCargarDocumentacionComponent } from './modal-cargar-documentacion.component';

describe('ModalCargarDocumentacionComponent', () => {
  let component: ModalCargarDocumentacionComponent;
  let fixture: ComponentFixture<ModalCargarDocumentacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCargarDocumentacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCargarDocumentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
