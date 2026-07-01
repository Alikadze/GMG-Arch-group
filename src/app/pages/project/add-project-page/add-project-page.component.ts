import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AddProjectComponent } from '../../../components/add-project/add-project.component';

@Component({
  selector: 'app-add-project-page',
  standalone: true,
  imports: [AddProjectComponent, TranslateModule],
  templateUrl: './add-project-page.component.html',
  styleUrl: './add-project-page.component.scss',
})
export class AddProjectPageComponent {
  private router = inject(Router);

  onAdded(): void {
    this.router.navigate(['/project/all']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  back(): void {
    this.router.navigate(['/project/all']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
