import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddvendorPage } from './addvendor.page';

describe('AddvendorPage', () => {
  let component: AddvendorPage;
  let fixture: ComponentFixture<AddvendorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddvendorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddvendorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
