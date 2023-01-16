import {TestBed} from '@angular/core/testing';

import {EncryptionService} from './encryption.service';

describe('EncyptionService', () => {
  let service: EncryptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncryptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true', () => {
    expect(service.decrypt(service.encrypt('test'))).toBe('test');
  })
});
