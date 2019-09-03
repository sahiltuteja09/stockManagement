import { TestBed } from '@angular/core/testing';

import { LocalnotificationService } from './localnotification.service';

describe('LocalnotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalnotificationService = TestBed.get(LocalnotificationService);
    expect(service).toBeTruthy();
  });
});
