import { Component, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';
import { IntersectionObserverService } from '../../core/services/intersection-observer.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-partner-companies',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './partner-companies.component.html',
  styleUrl: './partner-companies.component.scss'
})
export class PartnerCompaniesComponent implements OnInit, OnDestroy {
  companies = [
    {
      name: 'BuildTech Materials',
      category: 'Materials',
      icon: 'pi-box',
      description:
        'Premium concrete, steel, and finishing materials sourced for durability and delivered right on schedule.',
    },
    {
      name: 'Skyline Architects',
      category: 'Architecture',
      icon: 'pi-compass',
      description:
        'Award-winning architectural design partner shaping modern, functional, and elegant living spaces.',
    },
    {
      name: 'CoreStructure Engineering',
      category: 'Engineering',
      icon: 'pi-cog',
      description:
        'Structural engineering and load analysis that ensures every build stands the test of time.',
    },
    {
      name: 'AquaFlow Systems',
      category: 'Plumbing & HVAC',
      icon: 'pi-bolt',
      description:
        'Complete plumbing, heating, and climate solutions integrated seamlessly into each project.',
    },
    {
      name: 'GreenScape Design',
      category: 'Landscaping',
      icon: 'pi-sun',
      description:
        'Sustainable landscaping and outdoor environments that complement the surrounding architecture.',
    },
    {
      name: 'SecureHome Tech',
      category: 'Smart Systems',
      icon: 'pi-shield',
      description:
        'Smart-home automation and security systems for modern, safe, and connected residences.',
    },
  ];

  elementRef = inject(ElementRef);
  intersectionObserverService = inject(IntersectionObserverService);

  ngOnInit() {
    this.intersectionObserverService.observe(this.elementRef);
  }

  ngOnDestroy(): void {
    this.intersectionObserverService.unobserve(this.elementRef);
  }
}
