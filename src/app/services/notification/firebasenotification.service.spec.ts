import { TestBed } from '@angular/core/testing';

import { FirebasenotificationService } from './firebasenotification.service';

describe('FirebasenotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirebasenotificationService = TestBed.get(FirebasenotificationService);
    expect(service).toBeTruthy();
  });
});
