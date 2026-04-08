import { TestBed } from '@angular/core/testing';

import { PageableService } from './pageable.service';

describe('PageableService', () => {
  let service: PageableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
