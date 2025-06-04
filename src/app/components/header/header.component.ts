import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SelectLanguageComponent } from '../select-language/select-language.component';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthFacade } from '../../core/facades/auth.facade';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopup, ConfirmPopupModule } from 'primeng/confirmpopup';
import { AsyncPipe, isPlatformBrowser, NgClass, NgIf } from '@angular/common';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import gsap from 'gsap';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    TranslateModule,
    SelectLanguageComponent,
    ButtonModule,
    ToastModule,
    ConfirmPopupModule,
    NgClass,
    TieredMenuModule,
    AsyncPipe
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  router = inject(Router);
  authFacade = inject(AuthFacade);
  messageService = inject(MessageService);
  translateService = inject(TranslateService);
  confirmationService = inject(ConfirmationService);
  platformId = inject(PLATFORM_ID);
  cdr = inject(ChangeDetectorRef);

  items: MenuItem[] | undefined;
  destroy$ = new Subject<void>();
  isAuthenticated!: Observable<boolean>;

  ngOnInit() {
    this.isAuthenticated = this.authFacade.authState;

    this.translateService.onLangChange
      .pipe(
        tap(() => {
          this.translateService
            .get(['Home', 'Projects', 'About', 'Contact', 'Admin'])
            .pipe(
              tap((translations: any) => {
                this.items = [
                  {
                    label: translations['Home'],
                    icon: 'pi pi-home',
                    command: () => this.navigateToHome(),
                  },
                  {
                    label: translations['Projects'],
                    icon: 'pi pi-shop',
                    command: () => this.navigateToProject(),
                  },
                  {
                    label: translations['About'],
                    icon: 'pi pi-address-book',
                    command: () => this.navigateToAbout(),
                  },
                  {
                    label: translations['Contact'],
                    icon: 'pi pi-envelope',
                    command: () => this.navigateToContact(),
                  },
                  {
                    label: translations['Admin'],
                    icon: 'pi pi-user',
                    command: () => this.navigateToAuth(),
                  },
                ];
              }),
              takeUntil(this.destroy$)
            )
            .subscribe();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

 

  isActive(route: string): boolean {
    if (route === '/') {
      return this.router.url === route;
    }
    return this.router.url.startsWith(route);
  }

  @ViewChild(ConfirmPopup) confirmPopup!: ConfirmPopup;

  accept() {
    this.confirmPopup.accept();
  }

  reject() {
    this.confirmPopup.reject();
  }

  logout(event: Event) {
    this.translateService
      .get([
        'Are you sure you want to log out?',
        'Success',
        'Logged out successfully',
        'Error',
        'You have rejected',
      ])
      .pipe(
        tap((translations: any) => {
          this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: translations['Are you sure you want to log out?'],
            accept: () => {
              this.messageService.add({
                severity: 'success',
                summary: translations['Success'],
                detail: translations['Logged out successfully'],
                life: 1500,
              });
              this.authFacade.logOut();
            },
            reject: () => {
              this.messageService.add({
                severity: 'error',
                summary: translations['Error'],
                detail: translations['You have rejected'],
                life: 1500,
              });
            },
          });
        }),
        takeUntil(this.destroy$)
      ).subscribe();
  }

  navigateToHome() {
    this.router.navigate(['/']);
    window.scroll({
      top: 0,
      behavior: 'smooth',
    });
  }

  navigateToContact() {
    this.router.navigate(['/contact']);
    window.scroll({
      top: 0,
      behavior: 'smooth',
    });
  }

  navigateToAuth() {
    this.router.navigate(['/auth']);
    window.scroll({
      top: 0,
      behavior: 'smooth',
    });
  }

  navigateToProject() {
    this.router.navigate(['/project/all']);
    window.scroll({
      top: 0,
      behavior: 'smooth',
    });
  }

  navigateToAbout() {
    this.router.navigate(['/about']);
    window.scroll({
      top: 0,
      behavior: 'smooth',
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
