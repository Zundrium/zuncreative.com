import { TestBed } from '@angular/core/testing';

import { YamlReadService } from './yaml-read.service';

describe('YamlReadService', () => {
  let service: YamlReadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YamlReadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
