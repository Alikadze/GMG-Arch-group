import { NgClass, NgFor } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';
import { HomeImageService } from '../../core/services/home-image.service';
import { GalleriaModule } from 'primeng/galleria';
import { TranslateModule } from '@ngx-translate/core';
import { IntersectionObserverService } from '../../core/services/intersection-observer.service';

interface Slide {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [
    GalleriaModule,
    TranslateModule
  ],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent implements OnInit, OnDestroy {
  photoService = inject(HomeImageService);
  elementRef = inject(ElementRef);
  intersectionObserverService = inject(IntersectionObserverService);

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

  ngOnInit() {
    this.intersectionObserverService.observe(this.elementRef);

    this.photoService.getImages().then((images) => {
        this.images = images;
    });
  }

  ngOnDestroy(): void {
    this.intersectionObserverService.unobserve(this.elementRef);
  }
}
