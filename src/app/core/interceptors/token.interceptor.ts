import { HttpInterceptorFn } from '@angular/common/http';
import {catchError, throwError} from "rxjs";
import {inject} from "@angular/core";
import { AuthFacade } from '../facades/auth.facade';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authFacade = inject(AuthFacade)
  return next(req)
    .pipe(
      catchError((err: any) => {
        if (err.status === 400) {

          if (err.error.error.message === 'INVALID_ID_TOKEN') {
            authFacade.logOut()
            return throwError(() => err)
          }
        }
        return throwError(() => err)
      })
    )
};