import { inject, Injectable } from '@angular/core';
import { ContactUsPayload } from '../interfaces/contact-us';
import { ContactUsService } from '../services/contact-us.service';

@Injectable({
  providedIn: 'root'
})
export class ContactUsFacade {
  contactUsService = inject(ContactUsService);
  
  submitMessage(payload: ContactUsPayload): Promise<any> {
    return this.contactUsService.submitContactMessage(payload)
  }
}