import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyVendorsPage } from './my-vendors.page';

describe('MyVendorsPage', () => {
  let component: MyVendorsPage;
  let fixture: ComponentFixture<MyVendorsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyVendorsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyVendorsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
