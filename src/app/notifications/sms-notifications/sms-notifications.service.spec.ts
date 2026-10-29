import { TestBed } from '@angular/core/testing';

import { SmsNotificationsService } from './sms-notifications.service';

describe('SmsNotificationsService', () => {
  let service: SmsNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmsNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
