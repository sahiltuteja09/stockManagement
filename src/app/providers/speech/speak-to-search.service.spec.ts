import { TestBed } from '@angular/core/testing';

import { SpeakToSearchService } from './speak-to-search.service';

describe('SpeakToSearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpeakToSearchService = TestBed.get(SpeakToSearchService);
    expect(service).toBeTruthy();
  });
});
