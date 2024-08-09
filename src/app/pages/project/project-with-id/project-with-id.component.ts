import { Component, inject } from '@angular/core';
import { ProjectFacade } from '../../../core/facades/project.facade';
import { ActivatedRoute } from '@angular/router';
import { ProjectPayload } from '../../../core/interfaces/project';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-project-with-id',
  standalone: true,
  imports: [
    TranslateModule,
    DatePipe
  ],
  templateUrl: './project-with-id.component.html',
  styleUrl: './project-with-id.component.scss'
})
export class ProjectWithIdComponent {
  projectFacade = inject(ProjectFacade);
  private route = inject(ActivatedRoute);

  project: ProjectPayload | undefined;

  ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('projectId');
    if (projectId) {
      this.loadProject(projectId);
    }
  }

  loadProject(projectId: string) {
    this.projectFacade.getProjectById(projectId).subscribe(project => {
      this.project = project;
      project.startDate = this.convertToDate(project.startDate);
      project.endDate = this.convertToDate(project.endDate);
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
