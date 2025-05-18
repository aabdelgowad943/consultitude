import { TestBed } from '@angular/core/testing';

import { PassDataForChatService } from './pass-data-for-chat.service';

describe('PassDataForChatService', () => {
  let service: PassDataForChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PassDataForChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
