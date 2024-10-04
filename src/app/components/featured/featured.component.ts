import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion';
import { IntersectionObserverService } from '../../core/services/intersection-observer.service';
import gsap from 'gsap';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ScrollTrigger } from 'gsap/all';

@Component({
  selector: 'app-featured',
  standalone: true,
  imports: [
    DividerModule,
    TranslateModule,
    AccordionModule
  ],
  templateUrl: './featured.component.html',
  styleUrl: './featured.component.scss'
})
export class FeaturedComponent implements OnInit, OnDestroy, AfterViewInit {
  elementRef = inject(ElementRef);
  intersectionObserverService = inject(IntersectionObserverService);
  platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    // console.log("Initializing Scroll Animations");
    setTimeout(() => {
      if (isPlatformBrowser(this.platformId)) {
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.refresh(true);
  
  
        gsap.from(".firstPart", {
          x: -500,
          scrollTrigger: {
            trigger: ".firstPart",
            start: "top 100%",
            end: "bottom 90%",
            scrub: 1,
            // markers: true
          }
        });
  
        gsap.from(".secondPart", {
          y: 200,
          scrollTrigger: {
            trigger: ".secondPart",
            start: "top 130%",
            end: "bottom 120%",
            toggleActions: 'play none none none',
            scrub: 1,
            // markers: true
          }
        });
  
        gsap.from(".thirdPart", {
          x: 500,
          scrollTrigger: {
            trigger: ".thirdPart",
            start: "top 100%",
            end: "bottom 85%",
            toggleActions: 'play none none none',
            scrub: 1,
            // markers: true
          }
        });
      }
    }, 10);
    
  }

  ngOnInit() {
    this.intersectionObserverService.observe(this.elementRef);
    ScrollTrigger.refresh();
  }

  ngOnDestroy(): void {
    this.intersectionObserverService.unobserve(this.elementRef);
    // ScrollTrigger.getAll().forEach(st => st.kill());
  }
}
