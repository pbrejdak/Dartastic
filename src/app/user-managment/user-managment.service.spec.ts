import { TestBed } from '@angular/core/testing';

import { UserManagmentService } from './user-managment.service';

describe('UserManagmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserManagmentService = TestBed.get(UserManagmentService);
    expect(service).toBeTruthy();
  });
});
