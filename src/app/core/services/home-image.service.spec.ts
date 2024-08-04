import { TestBed } from '@angular/core/testing';

import { HomeImageService } from './home-image.service';

describe('HomeImageService', () => {
  let service: HomeImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
