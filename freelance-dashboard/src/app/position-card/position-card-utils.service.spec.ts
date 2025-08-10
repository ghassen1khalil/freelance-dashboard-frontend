import {TestBed} from '@angular/core/testing';

import {PositionCardUtilsService} from './position-card-utils.service';

describe('PositionCardUtilsService', () => {
  let service: PositionCardUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PositionCardUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
