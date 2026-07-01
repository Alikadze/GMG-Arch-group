import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  heroInView: boolean = false;

  leaders = [
    { name: 'John Doe', role: 'CEO', initials: 'JD' },
    { name: 'Jane Smith', role: 'COO', initials: 'JS' },
    { name: 'Alice Johnson', role: 'CFO', initials: 'AJ' },
    { name: 'Michael Brown', role: 'CTO', initials: 'MB' },
  ];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const heroSection = document.querySelector('section') as HTMLElement;
    const rect = heroSection.getBoundingClientRect();
    this.heroInView = rect.top < window.innerHeight && rect.bottom > 0;
  }
}
