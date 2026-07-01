import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';
import { HomeImageService } from '../../core/services/home-image.service';
import { GalleriaModule } from 'primeng/galleria';
import { TranslateModule } from '@ngx-translate/core';
import { IntersectionObserverService } from '../../core/services/intersection-observer.service';

import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { prefersReducedMotion } from '../../core/utils/motion';

import { PLATFORM_ID } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';



Swiper.use([Autoplay, Pagination, Navigation]);


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
export class CarouselComponent implements OnDestroy, OnInit {
  photoService = inject(HomeImageService);
  elementRef = inject(ElementRef);
  intersectionObserverService = inject(IntersectionObserverService);
  platformId = inject(PLATFORM_ID);

 

  swiper: Swiper | undefined;


  ngAfterViewInit() {
    setTimeout(() => {
      if (isPlatformBrowser(this.platformId)) {
        ScrollTrigger.refresh(true);
  
        this.initializeSwiper();
        gsap.registerPlugin(ScrollTrigger);
      }
    }, 10);
  }

  initializeSwiper() {
    this.swiper = new Swiper('.swiper-container', {
      loop: true,
      autoplay: prefersReducedMotion()
        ? false
        : {
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

  images: any[] = [];

  ngOnInit() {
    this.intersectionObserverService.observe(this.elementRef);
    ScrollTrigger.refresh();
    if (isPlatformBrowser(this.platformId)) {
      this.images = [
        { src: 'assets/images/Most-Beautiful-House-in-the-World_0_1200.jpg', alt: 'Image 1' },
        { src: 'assets/images/Most-Beautiful-House-in-the-World_0_1200.jpg', alt: 'Image 2' },
        { src: 'assets/images/Most-Beautiful-House-in-the-World_0_1200.jpg', alt: 'Image 3' }
      ]  
    }
  }


  ngOnDestroy(): void {
    this.intersectionObserverService.unobserve(this.elementRef);
  }
}
