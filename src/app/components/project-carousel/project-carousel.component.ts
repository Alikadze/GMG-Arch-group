import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, ɵɵqueryRefresh } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { ProjectImageService } from '../../core/services/project-image.service';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';

import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

Swiper.use([Autoplay, Pagination, Navigation]);

@Component({
  selector: 'app-project-carousel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    GalleriaModule,
    TranslateModule
  ],
  templateUrl: './project-carousel.component.html',
  styleUrl: './project-carousel.component.scss'
})
export class ProjectCarouselComponent {
  swiper!: Swiper;

  projectImageService = inject(ProjectImageService);
  route = inject(ActivatedRoute);
  cdr = inject(ChangeDetectorRef);

  images: any[] | undefined;

  responsiveOptions!: any[];

  destroy$ = new Subject<void>();

  projectId: string = this.route.snapshot.paramMap.get('projectId') as string;


  ngOnInit() {

    this.projectImageService.getProjectImages(this.projectId).pipe(
      tap(images => {
        // Render the slides first, THEN initialize Swiper so it sees every slide.
        this.images = images;
        this.cdr.detectChanges();

        if (typeof document !== 'undefined') {
          setTimeout(() => this.initializeSwiper(), 0);
        }
      }),

      takeUntil(this.destroy$)
    ).subscribe();

    this.responsiveOptions = [
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
  }

  initializeSwiper() {
    // Re-create cleanly in case images reload for a different project.
    if (this.swiper) {
      this.swiper.destroy(true, true);
    }

    this.swiper = new Swiper('.swiper-container', {
      loop: (this.images?.length ?? 0) > 1,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      effect: 'slide',
      speed: 800,
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
