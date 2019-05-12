import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyquotesPage } from './myquotes.page';

describe('MyquotesPage', () => {
  let component: MyquotesPage;
  let fixture: ComponentFixture<MyquotesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyquotesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyquotesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
