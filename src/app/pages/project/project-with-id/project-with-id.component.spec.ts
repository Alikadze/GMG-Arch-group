import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWithIdComponent } from './project-with-id.component';

describe('ProjectWithIdComponent', () => {
  let component: ProjectWithIdComponent;
  let fixture: ComponentFixture<ProjectWithIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectWithIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectWithIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
