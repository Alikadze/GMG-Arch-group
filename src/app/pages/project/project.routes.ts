import { Routes } from '@angular/router';
import { AllProjectsComponent } from './all-projects/all-projects.component';
import { ProjectWithIdComponent } from './project-with-id/project-with-id.component';

export const ProjectRoutes: Routes = [

  {
    path: 'all',
    component: AllProjectsComponent,
    title: 'GMG Arch group | Projects'
  },
  {
    path: ':projectId',
    component: ProjectWithIdComponent,
  }
];
