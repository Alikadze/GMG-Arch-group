import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ContactUsFormComponent } from '../../components/contact-us-form/contact-us-form.component';
import { SkeletonModule } from 'primeng/skeleton';
import { NgIf } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    TranslateModule,
    ButtonModule,
    DropdownModule,
    ContactUsFormComponent,
    SkeletonModule,
    NgIf
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('600ms ease-out', style({ transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class ContactComponent {
  mapLoading: boolean = true;

  onMapLoad() {
    this.mapLoading = false;
  }
}
