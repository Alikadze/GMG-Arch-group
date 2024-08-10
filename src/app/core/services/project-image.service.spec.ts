import { TestBed } from '@angular/core/testing';

import { ProjectImageService } from './project-image.service';

describe('ProjectImageService', () => {
  let service: ProjectImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
