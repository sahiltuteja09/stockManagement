import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScaninPage } from './scanin.page';

describe('ScaninPage', () => {
  let component: ScaninPage;
  let fixture: ComponentFixture<ScaninPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScaninPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScaninPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
