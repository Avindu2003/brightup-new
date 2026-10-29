import { TestBed } from '@angular/core/testing';

import { SubscriptionDashbordService } from './subscription-dashbord.service';

describe('SubscriptionDashbordService', () => {
  let service: SubscriptionDashbordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriptionDashbordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
