import { AfterViewInit, Component, inject, OnDestroy } from '@angular/core';
import { ProjectFacade } from '../../../core/facades/project.facade';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ProjectPayload } from '../../../core/interfaces/project';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DatePipe, isPlatformBrowser, NgIf } from '@angular/common';
import { ProjectCarouselComponent } from "../../../components/project-carousel/project-carousel.component";
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { MenuItem, MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { EditProjectComponent } from '../../../components/edit-project/edit-project.component';
import { SpeedDialModule } from 'primeng/speeddial';
import { AuthFacade } from '../../../core/facades/auth.facade';
import { filter, map, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { Title } from '@angular/platform-browser';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { PLATFORM_ID } from '@angular/core';


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
    SpeedDialModule,
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


  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.applyGSAPAnimations();
      }, 200);
    }
  }

  applyGSAPAnimations(): void {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".projectInfoCarousel", {
      x: -900,
      // opacity: 0,
      duration: 2,
      ease: "power4.out"
    });

    gsap.from(".projectInfo", {
      x: 900,
      // opacity: 0,
      duration: 2,
      ease: "power4.out"
    });
    
    gsap.from(".contact", {
      x: 900,
      // opacity: 0,
      duration: 2,
      ease: "power4.out"
    });

    gsap.to(".contact", {
      opacity: 1,
    });

    gsap.to(".projectInfo", {
      opacity: 1,
    });

    gsap.to(".projectInfoCarousel", {
      opacity: 1,
    });

    gsap.from(".projectInfoDescription", {
      x: 2000,
      scrollTrigger: {
        trigger: ".projectInfodescription",
        start: "top 100%",
        end: "bottom 90%",
        scrub: 1,
      }
    });
  }

  get isAuthecticated() {
    return this.authFacade.isAuthenticated
  }

  destroy$ = new Subject<void>();

  project: ProjectPayload | undefined;
  visible: boolean = false;
  projectId!: string | null;
  items!: MenuItem[];

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId');

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

    this.items = [
      {
        icon: 'pi pi-pencil',
        command: () => {
          this.showDialog();
        }
      },
      {
        icon: 'pi pi-trash',
        command: () => {
          this.deleteProject();
        }
      }
    ]

    // this.router.events.pipe(
    //   filter(event => event instanceof NavigationEnd),
    //   takeUntil(this.destroy$)
    // ).subscribe(() => {
    //   this.applyGSAPAnimations();
    // });
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
