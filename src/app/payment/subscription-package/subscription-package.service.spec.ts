import { TestBed } from '@angular/core/testing';
import { SubscriptionPackageService } from './subscription-package.service';

describe('SubscriptionPackageService', () => {
  let service: SubscriptionPackageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriptionPackageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
