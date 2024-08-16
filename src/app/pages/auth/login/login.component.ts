import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthFacade } from '../../../core/facades/auth.facade';
import { catchError, finalize, Subject, switchMap, take, takeUntil, tap, throwError } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    TranslateModule,
    DividerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('600ms ease-out', style({ transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class LoginComponent implements OnDestroy {
  authFacade = inject(AuthFacade);
  router = inject(Router);
  messageService = inject(MessageService);
  translateService = inject(TranslateService);


  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  loading: boolean = false;
  destroy$ = new Subject<void>();

  login() {
    this.loading = true;
  
    if (!this.form.valid) {
      this.translateService.get(['Error', 'Email is required', 'Wrong Email format', 'Password is required']).pipe(
        tap(translations => {
          if (this.form.get('email')?.hasError('required')) {
            this.messageService.add({ severity: 'error', summary: translations['Error'], detail: translations['Email is required'], life: 1500 });
          } else if (this.form.get('email')?.hasError('email')) {
            this.messageService.add({ severity: 'error', summary: translations['Error'], detail: translations['Wrong Email format'], life: 1500 });
          } else if (this.form.get('password')?.hasError('required')) {
            this.messageService.add({ severity: 'error', summary: translations['Error'], detail: translations['Password is required'], life: 1500 });
          }
        }),
        finalize(() => this.loading = false),
        takeUntil(this.destroy$)
      ).subscribe();
      return;
    }
  
    const { email, password } = this.form.value as { email: string, password: string };
    const payload = { email, password };
  
    this.authFacade.login(payload).pipe(
      switchMap(() => 
        this.translateService.get(['Success', 'Logged in successfully']).pipe(
          tap(translations => {
            this.messageService.add({ severity: 'success', summary: translations['Success'], detail: translations['Logged in successfully'], life: 1500 });
          }),
          tap(() => setTimeout(() => this.router.navigate(['/project/all']), 0))
        )
      ),
      catchError(() => 
        this.translateService.get(['Error', 'Invalid Email or Password']).pipe(
          tap(translations => {
            this.messageService.add({ severity: 'error', summary: translations['Error'], detail: translations['Invalid Email or Password'], life: 1500 });
          }),
          finalize(() => this.loading = false)
        )
      ),
      finalize(() => this.loading = false),
      takeUntil(this.destroy$)
    ).subscribe();
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}