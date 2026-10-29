import { TestBed } from '@angular/core/testing';

import { PackageActivationService } from './package-activation.service';

describe('PackageActivationService', () => {
  let service: PackageActivationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PackageActivationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
