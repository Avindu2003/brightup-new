import { TestBed } from '@angular/core/testing';

import { DeviceResetService } from './device-reset.service';

describe('DeviceResetService', () => {
  let service: DeviceResetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceResetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
