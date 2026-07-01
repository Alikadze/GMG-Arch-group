import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
  private router = inject(Router);

  goHome(): void {
    this.router.navigate(['/']);
  }

  goToProjects(): void {
    this.router.navigate(['/project/all']);
  }
}
