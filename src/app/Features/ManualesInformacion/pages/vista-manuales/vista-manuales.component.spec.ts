import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaManualesComponent } from './vista-manuales.component';

describe('VistaManualesComponent', () => {
  let component: VistaManualesComponent;
  let fixture: ComponentFixture<VistaManualesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaManualesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaManualesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
