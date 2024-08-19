import { inject, Injectable } from '@angular/core';
import { ContactUsPayload } from '../interfaces/contact-us';
import { ContactUsFirebaseService } from '../services/contact-us-firebase.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactUsFirebaseFacade {
  private contactUsService = inject(ContactUsFirebaseService);
  
  submitContactUs(payload: ContactUsPayload): Observable<string> {
    return this.contactUsService.addContactMessage(payload);
  }
}