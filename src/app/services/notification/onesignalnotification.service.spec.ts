import { TestBed } from '@angular/core/testing';

import { OnesignalnotificationService } from './onesignalnotification.service';

describe('OnesignalnotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OnesignalnotificationService = TestBed.get(OnesignalnotificationService);
    expect(service).toBeTruthy();
  });
});
