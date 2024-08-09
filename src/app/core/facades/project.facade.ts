import { inject, Injectable } from '@angular/core';
import { Observable, forkJoin, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ProjectPayload } from '../interfaces/project';
import { ProjectService } from '../services/project.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectFacade {
  projectService = inject(ProjectService)

  addProject(project: ProjectPayload, files: File[]): Observable<string> {
    const uploadTasks = files.map(file => this.projectService.uploadImage(file));
    return forkJoin(uploadTasks).pipe(
      switchMap(imageUrls => {
        project.images = imageUrls;
        return this.projectService.addProject(project);
      })
    );
  }

  getProjects(first: number, rows: number): Observable<{ projects: ProjectPayload[], totalRecords: number }> {
    return this.projectService.getProjects(first, rows);
  }

  getProjectById(id: string) {
    return this.projectService.getProjectWithId(id);
  }
}
