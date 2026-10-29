import { TestBed } from '@angular/core/testing';

import { PackageHistotyService } from './package-histoty.service';

describe('PackageHistotyService', () => {
  let service: PackageHistotyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PackageHistotyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
