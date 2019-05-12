import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestQuotePage } from './request-quote.page';

describe('RequestQuotePage', () => {
  let component: RequestQuotePage;
  let fixture: ComponentFixture<RequestQuotePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestQuotePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestQuotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
