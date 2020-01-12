import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KhataviewPage } from './khataview.page';

describe('KhataviewPage', () => {
  let component: KhataviewPage;
  let fixture: ComponentFixture<KhataviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhataviewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhataviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
