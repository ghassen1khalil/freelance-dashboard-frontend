import { TestBed } from '@angular/core/testing';

import { NullityUtilService } from './nullity-util.service';

describe('NullityUtilService', () => {
  let service: NullityUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NullityUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
