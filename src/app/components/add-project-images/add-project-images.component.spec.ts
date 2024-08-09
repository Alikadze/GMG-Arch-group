import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectImagesComponent } from './add-project-images.component';

describe('AddProjectImagesComponent', () => {
  let component: AddProjectImagesComponent;
  let fixture: ComponentFixture<AddProjectImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProjectImagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProjectImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
