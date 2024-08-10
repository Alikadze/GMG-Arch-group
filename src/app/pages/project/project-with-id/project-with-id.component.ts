import { Component, inject } from '@angular/core';
import { ProjectFacade } from '../../../core/facades/project.facade';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectPayload } from '../../../core/interfaces/project';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { ProjectCarouselComponent } from "../../../components/project-carousel/project-carousel.component";
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-project-with-id',
  standalone: true,
  imports: [
    TranslateModule,
    DatePipe,
    ProjectCarouselComponent,
    TagModule,
    ButtonModule,
],
  templateUrl: './project-with-id.component.html',
  styleUrl: './project-with-id.component.scss'
})
export class ProjectWithIdComponent {
  projectFacade = inject(ProjectFacade);
  private route = inject(ActivatedRoute);
  router = inject(Router);

  project: ProjectPayload | undefined;

  ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('projectId');
    if (projectId) {
      this.loadProject(projectId);
    }
  }

  navToContact() {
    this.router.navigate(['/contact']);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  loadProject(projectId: string) {
    this.projectFacade.getProjectById(projectId).subscribe(project => {
      this.project = project;
      project.startDate = this.convertToDate(project.startDate as Date);
      project.endDate = this.convertToDate(project.endDate as Date);
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
}
