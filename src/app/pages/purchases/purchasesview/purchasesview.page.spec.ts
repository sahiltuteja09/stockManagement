import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasesviewPage } from './purchasesview.page';

describe('PurchasesviewPage', () => {
  let component: PurchasesviewPage;
  let fixture: ComponentFixture<PurchasesviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasesviewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasesviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
