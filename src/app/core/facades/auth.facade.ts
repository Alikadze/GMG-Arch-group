import { inject, Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { AuthPayload } from '../interfaces/auth';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthFacade {
  private authService: AuthService = inject(AuthService);
  private storageService: StorageService = inject(StorageService);
  private router: Router = inject(Router);

  get isAuthenticated(): boolean {
    return !!this.user;
  }

  get user(): any {
    return this.storageService.getItem('user');
  }

  login(payload: AuthPayload): Observable<any> {
    return this.authService.login(payload).pipe(
      tap(res => {
        const token = res.user.getIdToken();
        const refreshToken = res.user.refreshToken;
        const user = {
          email: res.user.email,
          id: res.user.uid
        };

        this.storageService.setItem('token', token);
        this.storageService.setItem('refreshToken', refreshToken);
        this.storageService.setItem('user', user);
      })
    );
  }

  logOut(): void {
    this.storageService.removeItem('user');
    this.storageService.removeItem('refreshToken');
    this.storageService.removeItem('token');
    this.router.navigate(['/']);
  }
}
