import { inject, Injectable } from '@angular/core';
import { AuthPayload } from '../interfaces/auth';
import { from, Observable } from 'rxjs';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth = inject(Auth);

  login(payload: AuthPayload): Observable<any> {
    const promise = signInWithEmailAndPassword(this.auth, payload.email, payload.password);
    return from(promise);
  }
}
