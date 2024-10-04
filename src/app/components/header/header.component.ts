import {
  AfterViewInit,
  Component,
  inject,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SelectLanguageComponent } from '../select-language/select-language.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthFacade } from '../../core/facades/auth.facade';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopup, ConfirmPopupModule } from 'primeng/confirmpopup';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { Subject, takeUntil, tap } from 'rxjs';
import gsap from 'gsap';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    TranslateModule,
    SelectLanguageComponent,
    RouterLink,
    ButtonModule,
    ToastModule,
    ConfirmPopupModule,
    NgClass,
    TieredMenuModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('500ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  router = inject(Router);
  authFacade = inject(AuthFacade);
  messageService = inject(MessageService);
  translateService = inject(TranslateService);
  confirmationService = inject(ConfirmationService);
  platformId = inject(PLATFORM_ID);

  items: MenuItem[] | undefined;
  destroy$ = new Subject<void>();

  ngAfterViewInit(): void {
    if(isPlatformBrowser(this.platformId)){
      gsap.to('.mainContainer', {
        y: 0,  // Animate to its original position
        opacity: 1,
        duration: 1.2,
        ease: 'power1.out',  // Smooth deceleration
      });

      const letters = document.querySelectorAll('.reveal');

      letters.forEach((letter, index) => {
        gsap.to(letter, {
          y: 10,
          duration: 0.5,
          ease: 'sine.inOut',
          yoyo: false,
          repeat: -1,
          delay: index * 0.1,
          repeatDelay: 2,
        });
      });
    }
  }


  ngOnInit() {
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

  get isAuthenticated() {
    return this.authFacade.isAuthenticated;
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
