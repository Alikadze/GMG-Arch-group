import { NgClass } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  heroInView: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const heroSection = document.querySelector('section') as HTMLElement;
    const rect = heroSection.getBoundingClientRect();
    this.heroInView = rect.top < window.innerHeight && rect.bottom > 0;
  }
}
