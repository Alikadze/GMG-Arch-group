import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { ContactUsPayload } from '../interfaces/contact-us';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ContactUsFirebaseService {
  private firestore: Firestore = inject(Firestore);
  private contactUsCollection = collection(this.firestore, 'mail');

  addContactMessage(payload: ContactUsPayload) {
    const contactUsMessage = {
      to: payload.to,
      from: payload.from,
      message: {
        subject: payload.message.subject,
        html: payload.message.html,
      }
    };

    const promise = addDoc(this.contactUsCollection, contactUsMessage).then((response) => response.id);

    return from(promise);
  }
}
