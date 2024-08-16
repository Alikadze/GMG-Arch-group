import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { ProjectImageService } from '../../core/services/project-image.service';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-project-carousel',
  standalone: true,
  imports: [
    GalleriaModule,
    TranslateModule
  ],
  templateUrl: './project-carousel.component.html',
  styleUrl: './project-carousel.component.scss'
})
export class ProjectCarouselComponent implements OnDestroy, OnInit {
  projectImageService = inject(ProjectImageService);
  route = inject(ActivatedRoute);

  images: any[] | undefined;

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  destroy$ = new Subject<void>();

  projectId: string = this.route.snapshot.paramMap.get('projectId') as string;

  ngOnInit() {
    this.projectImageService.getProjectImages(this.projectId).pipe(
      tap(images => {
        this.images = images;
      }),
      takeUntil(this.destroy$)
    ).subscribe()
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
