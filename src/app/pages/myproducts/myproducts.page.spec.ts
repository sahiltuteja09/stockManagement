import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyproductsPage } from './myproducts.page';

describe('MyproductsPage', () => {
  let component: MyproductsPage;
  let fixture: ComponentFixture<MyproductsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyproductsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyproductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
