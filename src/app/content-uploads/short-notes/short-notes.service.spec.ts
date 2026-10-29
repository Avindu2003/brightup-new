import { TestBed } from '@angular/core/testing';

import { ShortNotesService } from './short-notes.service';

describe('ShortNotesService', () => {
  let service: ShortNotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShortNotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
