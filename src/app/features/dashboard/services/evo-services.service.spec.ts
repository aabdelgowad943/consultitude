import { TestBed } from '@angular/core/testing';

import { EvoServicesService } from './evo-services.service';

describe('EvoServicesService', () => {
  let service: EvoServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvoServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
