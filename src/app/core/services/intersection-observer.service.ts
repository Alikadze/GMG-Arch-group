import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IntersectionObserverService {
  observer!: IntersectionObserver;

  constructor() {
    if (typeof IntersectionObserver !== 'undefined') {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          } else {
            entry.target.classList.remove('visible');
          }
        });
      }, { threshold: 0.1 });
    }
  }

  observe(element: ElementRef): void {
    if (this.observer) {
      this.observer.observe(element.nativeElement);
    }
  }

  unobserve(element: ElementRef): void {
    if (this.observer) {
      this.observer.unobserve(element.nativeElement);
    }
  }
}
