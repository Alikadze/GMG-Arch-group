import { inject, Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ProjectPayload } from '../interfaces/project';
import { ProjectService } from '../services/project.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectFacade {
  private projectService = inject(ProjectService);

  addProject(project: ProjectPayload, files: File[]): Observable<string> {
    return forkJoin(files.map(file => this.projectService.uploadImage(file))).pipe(
      switchMap(imageUrls => {
        project.images = imageUrls;
        return this.projectService.addProject(project);
      })
    );
  }

  getProjects(first: number, rows: number, filter: string): Observable<{ projects: ProjectPayload[], totalRecords: number }> {
    return this.projectService.getProjects(first, rows, filter);
  }

  getProjectById(id: string): Observable<ProjectPayload> {
    return this.projectService.getProjectWithId(id);
  }

  updateProject(projectId: string, updatedFields: Partial<ProjectPayload>): Observable<void> {
    return this.projectService.updateProject(projectId, updatedFields);
  }
  
  deleteProject(projectId: string): Observable<void> {
    return this.projectService.deleteProject(projectId);
  }
}
