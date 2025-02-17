import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPreciosComponent } from './modal-precios.component';

describe('ModalPreciosComponent', () => {
  let component: ModalPreciosComponent;
  let fixture: ComponentFixture<ModalPreciosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalPreciosComponent]
    });
    fixture = TestBed.createComponent(ModalPreciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
