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
    PaginatorModule
],
  templateUrl: './all-projects.component.html',
  styleUrl: './all-projects.component.scss'
})
export class AllProjectsComponent {
  projectFacade = inject(ProjectFacade);
  router = inject(Router);
  route = inject(ActivatedRoute);

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
        startDate: this.convertToDate(project.startDate),
        endDate: this.convertToDate(project.endDate),
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
    return null;
  }

  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  navigateToProject(projectId: string | undefined) {
    if (projectId) {
      this.router.navigate([`/project/${projectId}`]);
    }
  }
}
