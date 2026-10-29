import { TestBed } from '@angular/core/testing';

import { SinhalaUtilService } from './sinhala-util.service';

describe('SinhalaUtilService', () => {
  let service: SinhalaUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SinhalaUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
