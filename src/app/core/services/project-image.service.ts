import { Injectable } from '@angular/core';
import { ProjectFacade } from '../facades/project.facade';
import { map, Observable, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProjectImageService {
  constructor(
    private projectFacade: ProjectFacade,
    private route: ActivatedRoute
  ) {}

  getProjectImages(projectId: string): Observable<any[]> {
    return this.projectFacade.getProjectById(projectId).pipe(
      map(response => response.images.map(image => 
        ({ itemImageSrc: image }))
      )
    );
  }
}
