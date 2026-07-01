import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthFacade } from '../facades/auth.facade';

/**
 * Blocks admin-only routes. `authState` is an in-memory BehaviorSubject, so
 * take(1) reads the current value synchronously — matching how the rest of the
 * app gates admin UI (edit/delete/add). Non-admins are sent to the login page.
 */
export const authGuard: CanActivateFn = () => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);

  return authFacade.authState.pipe(
    take(1),
    map((isAuthenticated) => (isAuthenticated ? true : router.createUrlTree(['/auth'])))
  );
};
