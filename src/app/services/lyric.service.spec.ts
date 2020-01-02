import { TestBed } from '@angular/core/testing';

import { LyricService } from './lyric.service';

describe('LyricService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LyricService = TestBed.get(LyricService);
    expect(service).toBeTruthy();
  });
});
