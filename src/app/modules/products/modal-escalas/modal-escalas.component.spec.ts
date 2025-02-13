import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEscalasComponent } from './modal-escalas.component';

describe('ModalEscalasComponent', () => {
  let component: ModalEscalasComponent;
  let fixture: ComponentFixture<ModalEscalasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalEscalasComponent]
    });
    fixture = TestBed.createComponent(ModalEscalasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
