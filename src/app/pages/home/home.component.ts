import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselComponent } from "../../components/carousel/carousel.component";
import { HomeInfoComponent } from "../../components/home-info/home-info.component";
import { FeaturedComponent } from "../../components/featured/featured.component";
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { PartnerCompaniesComponent } from "../../components/partner-companies/partner-companies.component";
import gsap from 'gsap';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ScrollTrigger } from 'gsap/all';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TranslateModule,
    CarouselComponent,
    FeaturedComponent,
    HomeInfoComponent,
    AnimateOnScrollModule,
    PartnerCompaniesComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  platformId = inject(PLATFORM_ID);

  ngOnInit() {
    ScrollTrigger.refresh();
  }

  ngAfterViewInit() {
    ScrollTrigger.refresh();
    if (isPlatformBrowser(this.platformId)) {
      // GSAP reveal effect for each word
      gsap.from(".reveal", { 
        y: 100, 
        opacity: 0, 
        duration: 1.5, 
        ease: "power4.out", 
        stagger: 0.2 
      });

      const letters = document.querySelectorAll('.reveal');

      letters.forEach((letter, index) => {
        gsap.to(letter, {
          y: 10,
          duration: 0.5,
          ease: "sine.inOut",
          yoyo: false, /* Yoyo effect for continuous bounce */
          repeat: -1,
          delay: index * 0.1,
          repeatDelay: 2
        });
      });
    }
  }
}
