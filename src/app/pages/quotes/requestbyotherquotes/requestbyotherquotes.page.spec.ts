import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestbyotherquotesPage } from './requestbyotherquotes.page';

describe('RequestbyotherquotesPage', () => {
  let component: RequestbyotherquotesPage;
  let fixture: ComponentFixture<RequestbyotherquotesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestbyotherquotesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestbyotherquotesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
