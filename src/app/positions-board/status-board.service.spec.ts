import {TestBed} from '@angular/core/testing';

import {StatusBoardService} from './status-board.service';

describe('StatusBoardService', () => {
  let service: StatusBoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatusBoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
