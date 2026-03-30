import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaInformacionComponent } from './vista-informacion.component';

describe('VistaInformacionComponent', () => {
  let component: VistaInformacionComponent;
  let fixture: ComponentFixture<VistaInformacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaInformacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaInformacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
