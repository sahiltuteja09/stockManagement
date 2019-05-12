import { TestBed } from '@angular/core/testing';

import { CurdService } from './curd.service';

describe('CurdService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CurdService = TestBed.get(CurdService);
    expect(service).toBeTruthy();
  });
});
