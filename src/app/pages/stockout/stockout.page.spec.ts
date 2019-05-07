import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockoutPage } from './stockout.page';

describe('StockoutPage', () => {
  let component: StockoutPage;
  let fixture: ComponentFixture<StockoutPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockoutPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
