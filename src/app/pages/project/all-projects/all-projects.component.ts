import { Component, inject, OnDestroy } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ProjectFacade } from '../../../core/facades/project.facade';
import { ProjectPayload } from '../../../core/interfaces/project';
import { AsyncPipe, DatePipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { AuthFacade } from '../../../core/facades/auth.facade';
import { FilterService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';


@Component({
  selector: 'app-all-projects',
  standalone: true,
  imports: [
    ButtonModule,
    TranslateModule,
    DatePipe,
    PaginatorModule,
    TagModule,
    DropdownModule,
    FormsModule,
    SkeletonModule,
    AsyncPipe
],
  templateUrl: './all-projects.component.html',
  styleUrl: './all-projects.component.scss'
})
export class AllProjectsComponent implements OnDestroy {
  projectFacade = inject(ProjectFacade);
  router = inject(Router);
  route = inject(ActivatedRoute);
  authFacade = inject(AuthFacade);
  filterService = inject(FilterService);
  translateService = inject(TranslateService);
  platformId = inject(PLATFORM_ID);

  isAuth$!: Observable<boolean>;


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
  destroy$ = new Subject<void>();

  private loadTranslations(): void {
    this.translateService.get(['All', 'Offered', 'Ended']).subscribe((translations: any) => {
      this.filterOptions = [
        { label: translations['All'], value: 'all' },
        { label: translations['Offered'], value: 'offered' },
        { label: translations['Ended'], value: 'ended' },
      ];
    });
  }
  

  selectFilter(value: string) {
    if (this.selectedFilter === value) {
      return;
    }
    this.selectedFilter = value;
    this.onFilterChange();
  }

  onFilterChange() {
    this.first = 0; // Reset to 0-based index
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
    });
  }


  onPageChange(event: PaginatorState) {
    this.first = event.first as number; // PrimeNG uses 0-based indexing
    
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

    if (typeof window !== 'undefined') {
      window.scroll({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
  

  projects: ProjectPayload[] = [];

  ngOnInit() {
    this.isAuth$ = this.authFacade.authState;
    this.route.queryParams.pipe(
      tap(params => {
        this.first = +params['first'] || 0; // Ensure 0-based
        this.rows = +params['rows'] || 6;
        this.selectedFilter = params['filter'] || 'all';
        this.loadProjects(this.first, this.rows);
      }),
      takeUntil(this.destroy$)
    ).subscribe();

    this.translateService.onLangChange.pipe(
      tap(() => this.loadTranslations()),
      takeUntil(this.destroy$)
    ).subscribe();

    this.loadTranslations();
    }

  goToAddProject() {
    this.router.navigate(['/project/add']);
    window.scroll({ top: 0, behavior: 'smooth' });
  }

  loadProjects(first: number, rows: number) {
    this.areProjectsLoading = true;

    this.projectFacade.getProjects(first, rows, this.selectedFilter).pipe(
      tap(response => {
        this.projects = response.projects.map(project => ({
          ...project,
          startDate: this.convertToDate(project.startDate as Date),
          endDate: this.convertToDate(project.endDate as Date),
        }));
        this.totalRecords = response.totalRecords;
        this.areProjectsLoading = false;
        this.animateCards();
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  private animateCards() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    setTimeout(() => {
      gsap.from('.project-card', {
        y: 40,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.09,
        clearProps: 'all',
      });
    }, 50);
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

  navigateToProject(projectId: string | undefined) {
    if (projectId) {
      this.router.navigate([`/project/${projectId}`]).then(() => {
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
