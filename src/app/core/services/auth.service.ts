import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AuthPayload } from '../interfaces/auth';
import { from, Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { signInWithEmailAndPassword } from '@firebase/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiService {
  firebaseAuth = inject(Auth)

  login(payload: AuthPayload) {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, payload.email, payload.password)

    return from(promise)
  }

}