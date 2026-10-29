import { TestBed } from '@angular/core/testing';

import { RegistrationSummaryService } from './registration-summary.service';

describe('RegistrationSummaryService', () => {
  let service: RegistrationSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrationSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
