import { Component, inject } from '@angular/core';
import { ProjectFacade } from '../../../core/facades/project.facade';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectPayload } from '../../../core/interfaces/project';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { ProjectCarouselComponent } from "../../../components/project-carousel/project-carousel.component";
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { MenuItem, MessageService } from 'primeng/api';
import { FormsModule, NgModel } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { EditProjectComponent } from '../../../components/edit-project/edit-project.component';
import { SpeedDialModule } from 'primeng/speeddial';
import { AuthFacade } from '../../../core/facades/auth.facade';


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
export class ProjectWithIdComponent {
  projectFacade = inject(ProjectFacade);
  route = inject(ActivatedRoute);
  messageService = inject(MessageService);
  router = inject(Router);
  translateService = inject(TranslateService);
  authFacade = inject(AuthFacade)

  get isAuthecticated() {
    return this.authFacade.isAuthenticated
  }

  project: ProjectPayload | undefined;
  visible: boolean = false;
  projectId!: string | null;
  items!: MenuItem[];

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId');

    if (this.projectId) {
      this.loadProject(this.projectId);
    }

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
  }

  loadProject(projectId: string): void {
    this.projectFacade.getProjectById(projectId).subscribe(project => {
      this.project = project;
      project.startDate = this.convertToDate(project.startDate as Date);
      project.endDate = this.convertToDate(project.endDate as Date);
    });
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

    this.projectFacade.updateProject(this.project.id, updatedProject).subscribe(() => {
      this.translateService.get(['Success','Project updated successfully']).subscribe(translations => {
        this.messageService.add({ severity: 'success', summary: translations['Success'], detail: translations['Project updated successfully'] });
      });
      this.loadProject(this.project?.id as string);
      this.visible = false;
    });
  }

  deleteProject(): void {
    this.projectFacade.deleteProject(this.projectId as string).subscribe(() => {
      this.translateService.get(['Success', 'Project deleted successfully']).subscribe(translations => { 
        this.messageService.add({ severity: 'success', summary: translations['Success'], detail: translations['Project deleted successfully'] });
      });
      this.router.navigate(['/projects']);
    });
  }
}
