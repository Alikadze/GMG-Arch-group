import { Component, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion';
import { IntersectionObserverService } from '../../core/services/intersection-observer.service';

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
export class FeaturedComponent implements OnInit, OnDestroy {
  elementRef = inject(ElementRef);
  intersectionObserverService = inject(IntersectionObserverService);

  ngOnInit() {
    this.intersectionObserverService.observe(this.elementRef);
  }

  ngOnDestroy(): void {
    this.intersectionObserverService.unobserve(this.elementRef);
  }
}
