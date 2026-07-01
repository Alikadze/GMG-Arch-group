import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IntersectionObserverService } from '../../core/services/intersection-observer.service';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { prefersReducedMotion } from '../../core/utils/motion';

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
    if(isPlatformBrowser(this.platformId) && !prefersReducedMotion()) {
      gsap.registerPlugin(ScrollTrigger);

      gsap.from(".firstCard", {
        x: -70,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".firstCard", start: "top 90%" }
      });

      gsap.from(".secondCard", {
        x: 70,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".secondCard", start: "top 90%" }
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
