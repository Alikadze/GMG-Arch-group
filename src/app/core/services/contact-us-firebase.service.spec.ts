import { TestBed } from '@angular/core/testing';

import { ContactUsFirebaseService } from './contact-us-firebase.service';

describe('ContactUsFirebaseService', () => {
  let service: ContactUsFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactUsFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
