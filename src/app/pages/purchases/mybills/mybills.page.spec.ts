import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MybillsPage } from './mybills.page';

describe('MybillsPage', () => {
  let component: MybillsPage;
  let fixture: ComponentFixture<MybillsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MybillsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MybillsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
