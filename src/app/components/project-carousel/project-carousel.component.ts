import { Component, inject } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { ProjectImageService } from '../../core/services/project-image.service';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

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
export class ProjectCarouselComponent {
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

  projectId: string = this.route.snapshot.paramMap.get('projectId') as string;

  ngOnInit() {
    this.projectImageService.getProjectImages(this.projectId).subscribe(images => {
      this.images = images;
    });
  }
}
