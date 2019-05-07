import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnordersPage } from './returnorders.page';

describe('ReturnordersPage', () => {
  let component: ReturnordersPage;
  let fixture: ComponentFixture<ReturnordersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnordersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnordersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
