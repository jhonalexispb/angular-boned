import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLotesComponent } from './modal-lotes.component';

describe('ModalLotesComponent', () => {
  let component: ModalLotesComponent;
  let fixture: ComponentFixture<ModalLotesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalLotesComponent]
    });
    fixture = TestBed.createComponent(ModalLotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
