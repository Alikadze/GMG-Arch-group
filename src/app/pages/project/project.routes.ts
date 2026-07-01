import { Routes } from '@angular/router';
import { AllProjectsComponent } from './all-projects/all-projects.component';
import { ProjectWithIdComponent } from './project-with-id/project-with-id.component';
import { AddProjectPageComponent } from './add-project-page/add-project-page.component';
import { authGuard } from '../../core/guards/auth.guard';

export const ProjectRoutes: Routes = [

  {
    path: 'all',
    component: AllProjectsComponent,
    title: 'GMG Arch group | Projects'
  },
  {
    path: 'add',
    component: AddProjectPageComponent,
    title: 'GMG Arch group | Add Project',
    canActivate: [authGuard]
  },
  {
    path: ':projectId',
    component: ProjectWithIdComponent,
  }
];
