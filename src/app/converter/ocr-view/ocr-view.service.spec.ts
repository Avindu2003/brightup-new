import { TestBed } from '@angular/core/testing';

import { OcrViewService } from './ocr-view.service';

describe('OcrViewService', () => {
  let service: OcrViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OcrViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
