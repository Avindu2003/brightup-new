import { TestBed } from '@angular/core/testing';

import { EducationalDetailsService } from './educational-details.service';

describe('EducationalDetailsService', () => {
  let service: EducationalDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EducationalDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
