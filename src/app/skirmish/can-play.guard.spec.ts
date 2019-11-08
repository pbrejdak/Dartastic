import { TestBed, async, inject } from '@angular/core/testing';

import { CanPlayGuard } from './can-play.guard';

describe('CanPlayGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanPlayGuard]
    });
  });

  it('should ...', inject([CanPlayGuard], (guard: CanPlayGuard) => {
    expect(guard).toBeTruthy();
  }));
});
