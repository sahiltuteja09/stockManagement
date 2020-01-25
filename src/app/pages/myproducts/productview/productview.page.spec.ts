import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductviewPage } from './productview.page';

describe('ProductviewPage', () => {
  let component: ProductviewPage;
  let fixture: ComponentFixture<ProductviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductviewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
