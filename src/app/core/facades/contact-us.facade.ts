import { inject, Injectable } from '@angular/core';
import { ContactUsPayload } from '../interfaces/contact-us';
import { ContactUsFirebaseService } from '../services/contact-us-firebase.service';

@Injectable({
  providedIn: 'root'
})
export class ContactUsFirebaseFacade {
  contactUsFirebaseService = inject(ContactUsFirebaseService);
  
  submitContactUs(payload: ContactUsPayload) {
    return this.contactUsFirebaseService.addContactMessage(payload);
  }
}