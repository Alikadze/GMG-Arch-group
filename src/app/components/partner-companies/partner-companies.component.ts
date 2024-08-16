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
    { name: 'Company A', description: 'Description of Company A' },
    { name: 'Company B', description: 'Description of Company B' },
    { name: 'Company C', description: 'Description of Company C' },
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
