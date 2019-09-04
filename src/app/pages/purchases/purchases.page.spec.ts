import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasesPage } from './purchases.page';

describe('PurchasesPage', () => {
  let component: PurchasesPage;
  let fixture: ComponentFixture<PurchasesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
