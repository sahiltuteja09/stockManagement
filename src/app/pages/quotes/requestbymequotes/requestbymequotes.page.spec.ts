import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestbymequotesPage } from './requestbymequotes.page';

describe('RequestbymequotesPage', () => {
  let component: RequestbymequotesPage;
  let fixture: ComponentFixture<RequestbymequotesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestbymequotesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestbymequotesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
