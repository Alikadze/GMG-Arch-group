import { Component, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IntersectionObserverService } from '../../core/services/intersection-observer.service';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';

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
export class HomeInfoComponent implements OnInit, OnDestroy {
  elementRef = inject(ElementRef);
  intersectionObserverService = inject(IntersectionObserverService);

  ngOnInit() {
    this.intersectionObserverService.observe(this.elementRef);
  }

  ngOnDestroy(): void {
    this.intersectionObserverService.unobserve(this.elementRef);
  }
}
