import { AfterViewChecked, AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';
import { IntersectionObserverService } from '../../core/services/intersection-observer.service';
import { TranslateModule } from '@ngx-translate/core';
import gsap from 'gsap';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ScrollTrigger } from 'gsap/all';

@Component({
  selector: 'app-partner-companies',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './partner-companies.component.html',
  styleUrl: './partner-companies.component.scss'
})
export class PartnerCompaniesComponent implements OnInit, OnDestroy, AfterViewInit {
  companies = [
    { name: 'Company A', description: 'Description of Company A' },
    { name: 'Company B', description: 'Description of Company B' },
    { name: 'Company C', description: 'Description of Company C' },
  ];

  elementRef = inject(ElementRef);
  intersectionObserverService = inject(IntersectionObserverService);
  platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    // ScrollTrigger.refresh();
    // console.log("Initializing Scroll Animations");
    setTimeout(() => {
      if (isPlatformBrowser(this.platformId)) {
        ScrollTrigger.refresh(true);
  
        gsap.registerPlugin(ScrollTrigger);
  
        gsap.from(".mainContainerCompany", {
          x: 1000,
          scrollTrigger: {
            trigger: ".mainContainerCompany",
            start: "top 100%",
            end: "bottom 80%",
            toggleActions: 'play none none none',
            scrub: 1,
            // markers: true
          }     
        });
  
        gsap.from(".company", {
          y: 200,
          scrollTrigger: {
            trigger: ".company",
            start: "top 120%",
            toggleActions: 'play none none none',
            end: "bottom 100%",
            scrub: 1,
            // markers: true
          }
        });
      }
    }, 10);
  }

  ngOnInit() {
    this.intersectionObserverService.observe(this.elementRef);
  }

  ngOnDestroy(): void {
    this.intersectionObserverService.unobserve(this.elementRef);
    // ScrollTrigger.getAll().forEach(t => t.kill());
  }
}
