import { TestBed } from '@angular/core/testing';

import { SlideContainerEventService } from './slide-container-event.service';

describe('SlideContainerEventService', () => {
  let service: SlideContainerEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlideContainerEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
