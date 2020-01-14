import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddkhataPage } from './addkhata.page';

describe('AddkhataPage', () => {
  let component: AddkhataPage;
  let fixture: ComponentFixture<AddkhataPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddkhataPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddkhataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
