import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ContactUsFormComponent } from "../../components/contact-us-form/contact-us-form.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TranslateModule,
    ButtonModule,
    DropdownModule,
    ContactUsFormComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  loading: boolean = false;

  load() {
      this.loading = true;

      setTimeout(() => {
          this.loading = false
      }, 2000);
  }
}
