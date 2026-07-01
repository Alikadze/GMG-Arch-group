import { AfterViewInit, Component, inject, OnDestroy } from '@angular/core';
import { ProjectFacade } from '../../../core/facades/project.facade';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ProjectPayload } from '../../../core/interfaces/project';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AsyncPipe, DatePipe, isPlatformBrowser, NgIf } from '@angular/common';
import { ProjectCarouselComponent } from "../../../components/project-carousel/project-carousel.component";
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { EditProjectComponent } from '../../../components/edit-project/edit-project.component';
import { ProjectInquiryComponent } from '../../../components/project-inquiry/project-inquiry.component';
import { TooltipModule } from 'primeng/tooltip';
import { AuthFacade } from '../../../core/facades/auth.facade';
import { filter, map, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { Title } from '@angular/platform-browser';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { PLATFORM_ID } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-project-with-id',
  standalone: true,
  imports: [
    TranslateModule,
    DatePipe,
    ProjectCarouselComponent,
    TagModule,
    ButtonModule,
    NgIf,
    FormsModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    EditProjectComponent,
    ProjectInquiryComponent,
    TooltipModule,
    AsyncPipe,
    ProgressSpinnerModule
  ],
  templateUrl: './project-with-id.component.html',
  styleUrl: './project-with-id.component.scss'
})
export class ProjectWithIdComponent implements OnDestroy {
  projectFacade = inject(ProjectFacade);
  route = inject(ActivatedRoute);
  messageService = inject(MessageService);
  router = inject(Router);
  translateService = inject(TranslateService);
  authFacade = inject(AuthFacade);
  titleService = inject(Title);
  platformId = inject(PLATFORM_ID);


  // Reveal is triggered from loadProject() once the project data has rendered.

  applyGSAPAnimations(): void {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(".projectInfoCarousel",
      { x: -60, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );

    gsap.fromTo(".projectInfo",
      { x: 60, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, delay: 0.12, ease: "power3.out" }
    );

    gsap.fromTo(".contact",
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, delay: 0.5, ease: "power3.out" }
    );

    gsap.fromTo(".projectDescription",
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".projectDescription", start: "top 88%" }
      }
    );
  }

  isAuthenticated!: Observable<boolean>;

  destroy$ = new Subject<void>();

  project: ProjectPayload | undefined;
  visible: boolean = false;
  inquiryVisible: boolean = false;
  projectId!: string | null;

  openInquiry(): void {
    this.inquiryVisible = true;
  }

  onInquirySent(): void {
    this.inquiryVisible = false;
  }

  ngOnInit(): void {

    this.projectId = this.route.snapshot.paramMap.get('projectId');
    
    if (typeof window === 'undefined') {
      return;
    }

    scroll({
      top: 0,
    });

    this.isAuthenticated = this.authFacade.authState;

    ScrollTrigger.refresh();

    if (this.projectId) {
      this.loadProject(this.projectId);
    }

    this.route.params.pipe(
      switchMap(params => this.projectFacade.getProjectById(params['projectId'])),
      map(project => project.name)
    ).pipe(
      tap(projectName => {
        this.titleService.setTitle(`GMG Arch group | ${projectName}`);
      }),
      takeUntil(this.destroy$)
    ).subscribe();

  }

  ngAfterViewChecked(): void {
    ScrollTrigger.refresh(); // Refresh ScrollTrigger after each view check to make sure elements are correctly targeted.
  }

  loadProject(projectId: string): void {
    this.projectFacade.getProjectById(projectId).pipe(
      tap(project => {
        this.project = project;
        project.startDate = this.convertToDate(project.startDate as Date);
        project.endDate = this.convertToDate(project.endDate as Date);

        if (isPlatformBrowser(this.platformId)) {
          // Wait for the *ngIf block to render, then reveal.
          setTimeout(() => this.applyGSAPAnimations(), 80);
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  showDialog(): void {
    this.visible = true;
  }

  navToContact() {
    this.router.navigate(['/contact']);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  navToProjects() {
    this.router.navigate(['/project/all']);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
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

  onProjectEditted(updatedProject: ProjectPayload): void {
    if (!this.project?.id) return;

    this.projectFacade.updateProject(this.project.id, updatedProject).pipe(
      tap(() => {
        this.translateService.get(['Success','Project updated successfully']).pipe(
          tap(translations => {
            this.messageService.add({ severity: 'success', summary: translations['Success'], detail: translations['Project updated successfully'] });
          }),
          tap(() => this.loadProject(this.project?.id as string)),
          tap(() => this.visible = false),
          takeUntil(this.destroy$)
        ).subscribe();
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  deleteProject(): void {
    this.projectFacade.deleteProject(this.projectId as string).pipe(
      tap(() => {
        this.translateService.get(['Success', 'Project deleted successfully']).pipe(
          tap(translations => {
            this.messageService.add({ severity: 'success', summary: translations['Success'], detail: translations['Project deleted successfully'] });
          }),
          tap(() => this.router.navigate(['/project/all'])),
          takeUntil(this.destroy$)
        ).subscribe();
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnDestroy(): void {
    ScrollTrigger.killAll();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
