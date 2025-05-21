import { TestBed } from '@angular/core/testing';

import { UserFollowerService } from './user-follower.service';

describe('UserFollowerService', () => {
  let service: UserFollowerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserFollowerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
