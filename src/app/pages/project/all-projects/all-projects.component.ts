import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AddProjectComponent } from "../../../components/add-project/add-project.component";
import { ProjectFacade } from '../../../core/facades/project.facade';
import { ProjectPayload } from '../../../core/interfaces/project';
import { DatePipe, JsonPipe, NgFor } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { AuthFacade } from '../../../core/facades/auth.facade';

@Component({
  selector: 'app-all-projects',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    AddProjectComponent,
    NgFor,
    TranslateModule,
    DatePipe,
    JsonPipe,
    PaginatorModule,
    TagModule
],
  templateUrl: './all-projects.component.html',
  styleUrl: './all-projects.component.scss'
})
export class AllProjectsComponent {
  projectFacade = inject(ProjectFacade);
  router = inject(Router);
  route = inject(ActivatedRoute);
  authFacade = inject(AuthFacade);

  get isAuthenticated() {
    return this.authFacade.isAuthenticated
  }

  first: number = 1;
  rows: number = 6;
  totalRecords: number = 100;


  onPageChange(event: PaginatorState) {
    const totalPages = Math.ceil(this.totalRecords / this.rows);
    this.first = Math.min(event.first as number, (totalPages - 1) * this.rows); // Ensure `first` doesn't exceed total pages
  
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        first: this.first,
        rows: this.rows
      },
      queryParamsHandling: 'merge',
    });
  
    this.loadProjects(this.first, this.rows);
  
    window.scroll({
      top: 0,
      behavior: 'smooth'
    })
  }
  

  projects: ProjectPayload[] = [];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.first = +params['first'] || 1;
      this.rows = +params['rows'] || 6;
      this.loadProjects(this.first, this.rows);
    });
  }

  loadProjects(first: number, rows: number) {
    this.projectFacade.getProjects(first, rows).subscribe((response) => {
      this.projects = response.projects.map(project => ({
        ...project,
        startDate: this.convertToDate(project.startDate as Date),
        endDate: this.convertToDate(project.endDate as Date),
      }));
      this.totalRecords = response.totalRecords;
    });
  }


  convertToDate(timestamp: {seconds: number, namoseconds: number} | Date): Date {
    if (typeof timestamp === 'undefined') {
      return new Date();
    }
    
    if ('seconds' in timestamp) {
      return new Date(timestamp.seconds * 1000);
    }
    return timestamp as Date;
  }

  onProjectAdded(newProject: ProjectPayload) {
    this.projects.push(newProject);
    this.visible = false;
    this.first = 1; // Go back to the first page
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        first: this.first,
        rows: this.rows
      },
      queryParamsHandling: 'merge',
    });
    this.loadProjects(this.first, this.rows);
    return null;
  }

  visible: boolean = false;

  showDialog() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        first: this.rows,  // This will navigate to the second page
        rows: this.rows
      },
      queryParamsHandling: 'merge',
    }).then(() => {
      this.visible = true;  // Show the dialog after navigation
    });
  }

  navigateToProject(projectId: string | undefined) {
    if (projectId) {
      this.router.navigate([`/project/${projectId}`]);
    }
  }
}
