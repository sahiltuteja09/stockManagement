import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MypurchasesPage } from './mypurchases.page';

describe('MypurchasesPage', () => {
  let component: MypurchasesPage;
  let fixture: ComponentFixture<MypurchasesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MypurchasesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MypurchasesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
