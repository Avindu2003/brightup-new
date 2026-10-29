import { TestBed } from '@angular/core/testing';

import { ContentSummaryService } from './content-summary.service';

describe('ContentSummaryService', () => {
  let service: ContentSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
