import { TestBed } from '@angular/core/testing';

import { SkirmishService } from './skirmish.service';

describe('SkirmishService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SkirmishService = TestBed.get(SkirmishService);
    expect(service).toBeTruthy();
  });
});
