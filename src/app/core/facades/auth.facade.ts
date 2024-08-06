import { inject, Injectable } from "@angular/core"
import { AuthService } from "../services/auth.service"
import { StorageService } from "../services/storage.service"
import { AuthPayload } from "../interfaces/auth"
import { tap } from "rxjs"
import { Router } from "@angular/router"

@Injectable({
  providedIn: 'root'
})
export class AuthFacade {
  authSevice = inject(AuthService)
  storageService = inject(StorageService)
  router = inject(Router)

  login(payload: AuthPayload) {
    return this.authSevice.login(payload)
    .pipe(
      tap(res => {
        this.storageService.setItem('token', res.user.getIdToken())
        this.storageService.setItem('refreshToken', res.user.refreshToken)
        this.storageService.setItem('user', {
          email: res.user.email,
          id: res.user.uid
        })
      })
    )
  }

  logOut() {
    this.storageService.clear()
    this.router.navigate(['/'])
  }
}