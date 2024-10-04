import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IntersectionObserverService } from '../../core/services/intersection-observer.service';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import gsap from 'gsap';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home-info',
  standalone: true,
  imports: [
    TranslateModule,
    AnimateOnScrollModule
  ],
  templateUrl: './home-info.component.html',
  styleUrl: './home-info.component.scss'
})
export class HomeInfoComponent implements AfterViewInit {
  elementRef = inject(ElementRef);
  intersectionObserverService = inject(IntersectionObserverService);
  platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    if(isPlatformBrowser(this.platformId)) {
      gsap.from(".firstCard", {
        x: -600,
        opacity: 0,
        duration: 3,
        ease: "power4.out"
      });

      gsap.from(".secondCard", {
        x: 600,
        opacity: 0,
        duration: 3,
        ease: "power4.out"
      });
    }
  }

  // ngOnInit() {
  //   this.intersectionObserverService.observe(this.elementRef);
  // }
  

  // ngOnDestroy(): void {
  //   this.intersectionObserverService.unobserve(this.elementRef);
  // }
}
