import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AddProjectComponent } from "../../../components/add-project/add-project.component";
import { ProjectFacade } from '../../../core/facades/project.facade';
import { ProjectPayload } from '../../../core/interfaces/project';
import { DatePipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { AuthFacade } from '../../../core/facades/auth.facade';
import { FilterService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';

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
    TagModule,
    DropdownModule,
    FormsModule,
    NgIf,
    SkeletonModule
],
  templateUrl: './all-projects.component.html',
  styleUrl: './all-projects.component.scss'
})
export class AllProjectsComponent {
  projectFacade = inject(ProjectFacade);
  router = inject(Router);
  route = inject(ActivatedRoute);
  authFacade = inject(AuthFacade);
  filterService = inject(FilterService);
  translateService = inject(TranslateService);


  get isAuthenticated() {
    return this.authFacade.isAuthenticated
  }


  first: number = 1;
  rows: number = 6;
  totalRecords: number = 100;

  selectedFilter: string = 'all';

  filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Offered', value: 'offered' },
    { label: 'Ended', value: 'ended' }
  ];

  areProjectsLoading = false;

  private loadTranslations(): void {
    this.translateService.get(['All', 'Offered', 'Ended']).subscribe((translations: any) => {
      this.filterOptions = [
        { label: translations['All'], value: 'all' },
        { label: translations['Offered'], value: 'offered' },
        { label: translations['Ended'], value: 'ended' },
      ];
    });
  }
  

  onFilterChange() {
    this.first = 1; // Reset to the first page when filter changes
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        first: this.first,
        rows: this.rows,
        filter: this.selectedFilter
      },
      queryParamsHandling: 'merge',
    });
    this.loadProjects(this.first, this.rows);

    window.scroll({
      top: 0,
      behavior: 'smooth'
    })
  }


  onPageChange(event: PaginatorState) {
    const totalPages = Math.ceil(this.totalRecords / this.rows);
    this.first = Math.min(event.first as number, (totalPages - 1) * this.rows);
  
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        first: this.first,
        rows: this.rows,
        filter: this.selectedFilter
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
      this.first = +params['first'] || 0; // Changed to 0-based index
      this.rows = +params['rows'] || 6;
      this.selectedFilter = params['filter'] || 'all';
      this.loadProjects(this.first, this.rows);
    });

    this.translateService.onLangChange.subscribe(() => {
      this.loadTranslations()
    });

    this.loadTranslations();
  }

  loadProjects(first: number, rows: number) {
    this.areProjectsLoading = true;

    this.projectFacade.getProjects(first, rows, this.selectedFilter).subscribe((response) => {
        this.projects = response.projects.map(project => ({
            ...project,
            startDate: this.convertToDate(project.startDate as Date),
            endDate: this.convertToDate(project.endDate as Date),
        }));
        this.totalRecords = response.totalRecords;
        this.areProjectsLoading = false;
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
    this.first = 1;
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
