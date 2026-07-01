import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ContactUsPayload } from '../../core/interfaces/contact-us';
import { ContactUsFirebaseFacade } from '../../core/facades/contact-us.facade';
import { MessageService, TranslationKeys } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-contact-us-form',
  standalone: true,
  imports: [
    InputTextModule,
    FormsModule,
    FloatLabelModule,
    InputTextareaModule,
    ButtonModule,
    TranslateModule,
    ReactiveFormsModule,
    ToastModule,
    TooltipModule,
    InputMaskModule,
    DropdownModule,
  ],
  templateUrl: './contact-us-form.component.html',
  styleUrls: ['./contact-us-form.component.scss'],
})
export class ContactUsFormComponent implements OnInit, OnDestroy {
  contactUsFirebaseFacade = inject(ContactUsFirebaseFacade);
  messageService = inject(MessageService);
  translateService = inject(TranslateService);

  subjects: { label: string; value: string }[] = [];
  selectedSubject!: string;

  destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.translateService.onLangChange
      .pipe(
        tap(() => {
          this.loadTranslations();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.loadTranslations();
  }

  private loadTranslations(): void {
    this.translateService
      .get(['Projecting', 'Construction', 'Interior Design', 'Other'])
      .pipe(
        tap((translations: any) => {
          this.subjects = [
            { label: translations['Projecting'], value: 'პროექტირება' },
            { label: translations['Construction'], value: 'მშენებლობა' },
            {
              label: translations['Interior Design'],
              value: 'ინტერიერის დიზაინი',
            },
            { label: translations['Other'], value: 'სხვა' },
          ];
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    from: new FormControl('', [Validators.required, Validators.email]),
    subject: new FormControl('', Validators.required),
    message: new FormControl('', Validators.required),
    number: new FormControl('', [Validators.required]),
  });

  loading: boolean = false;

  submit() {
    this.loading = true;

    if (!this.form.valid) {
      this.translateService
        .get([
          'Error',
          'Name is required',
          'Mail is required',
          'Incorrect mail format',
          'Number is required',
          'Subject is required',
          'Message is required',
        ])
        .pipe(
          tap((translations: any) => {
            const errorSummary = translations['Error'];
            if (this.form.get('name')?.hasError('required')) {
              this.messageService.add({
                severity: 'error',
                summary: errorSummary,
                detail: translations['Name is required'],
                life: 1500,
              });
            } else if (this.form.get('from')?.hasError('required')) {
              this.messageService.add({
                severity: 'error',
                summary: errorSummary,
                detail: translations['Mail is required'],
                life: 1500,
              });
            } else if (this.form.get('from')?.hasError('email')) {
              this.messageService.add({
                severity: 'error',
                summary: errorSummary,
                detail: translations['Incorrect mail format'],
                life: 1500,
              });
            } else if (this.form.get('number')?.hasError('required')) {
              this.messageService.add({
                severity: 'error',
                summary: errorSummary,
                detail: translations['Number is required'],
                life: 1500,
              });
            } else if (this.form.get('subject')?.hasError('required')) {
              this.messageService.add({
                severity: 'error',
                summary: errorSummary,
                detail: translations['Subject is required'],
                life: 1500,
              });
            } else if (this.form.get('message')?.hasError('required')) {
              this.messageService.add({
                severity: 'error',
                summary: errorSummary,
                detail: translations['Message is required'],
                life: 1500,
              });
            }
          }),
          takeUntil(this.destroy$)
        )
        .subscribe();

      this.loading = false;
      return;
    }

    const { name, from, subject, message, number } = this.form.value as {
      name: string;
      from: string;
      subject: string;
      message: string;
      number: string;
    };

    const messageFormat = this.buildEmailTemplate({ name, from, number, subject, message });

    const payload: ContactUsPayload = {
      to: ['kilpero84@gmail.com'],
      from,
      message: {
        subject: subject,
        html: messageFormat,
      },
    };

    this.contactUsFirebaseFacade
      .submitContactUs(payload)
      .pipe(
        tap(() => {
          this.translateService
            .get(['Success', 'Message sent successfully'])
            .pipe(
              tap((translations: any) => {
                this.messageService.add({
                  severity: 'success',
                  summary: translations['Success'],
                  detail: translations['Message sent successfully'],
                  life: 1500,
                });
              }),
              tap(() => {
                this.form.reset();
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                });
              }),
              tap(() => {
                this.loading = false;
              }),
              takeUntil(this.destroy$)
            )
            .subscribe();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private buildEmailTemplate(data: {
    name: string;
    from: string;
    number: string;
    subject: string;
    message: string;
  }): string {
    const { name, from, number, subject, message } = data;
    const safeMessage = (message || '').replace(/\n/g, '<br>');

    const row = (label: string, value: string) => `
      <tr>
        <td style="padding:12px 24px;border-bottom:1px solid #eceae4;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#8a8478;text-transform:uppercase;letter-spacing:1px;white-space:nowrap;vertical-align:top;">${label}</td>
        <td style="padding:12px 24px;border-bottom:1px solid #eceae4;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#16181d;font-weight:600;vertical-align:top;">${value}</td>
      </tr>`;

    return `
    <!DOCTYPE html>
    <html lang="ka">
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#f5f4f1;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f4f1;padding:32px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:6px;overflow:hidden;box-shadow:0 10px 40px -12px rgba(22,24,29,0.18);">

              <!-- Hazard accent bar -->
              <tr><td style="height:6px;background:repeating-linear-gradient(-45deg,#f97316,#f97316 14px,#16181d 14px,#16181d 28px);font-size:0;line-height:0;">&nbsp;</td></tr>

              <!-- Header -->
              <tr>
                <td style="background:#16181d;padding:32px 32px;">
                  <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:3px;color:#f97316;text-transform:uppercase;font-weight:bold;">ახალი შეტყობინება</div>
                  <div style="font-family:'Trebuchet MS',Arial,sans-serif;font-size:30px;letter-spacing:1px;color:#ffffff;text-transform:uppercase;font-weight:bold;margin-top:6px;">GMG ARCH GROUP</div>
                </td>
              </tr>

              <!-- Intro -->
              <tr>
                <td style="padding:28px 32px 8px 32px;">
                  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#525966;line-height:1.6;">
                    საიტიდან მიღებულია ახალი შეტყობინება საკონტაქტო ფორმის მეშვეობით. დეტალები მოცემულია ქვემოთ.
                  </p>
                </td>
              </tr>

              <!-- Details table -->
              <tr>
                <td style="padding:16px 8px 8px 8px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eceae4;border-radius:4px;overflow:hidden;">
                    ${row('სახელი', name)}
                    ${row('ელ-ფოსტა', `<a href="mailto:${from}" style="color:#ea580c;text-decoration:none;">${from}</a>`)}
                    ${row('ტელეფონი', `<a href="tel:${number}" style="color:#16181d;text-decoration:none;">${number}</a>`)}
                    ${row('თემა', subject)}
                  </table>
                </td>
              </tr>

              <!-- Message -->
              <tr>
                <td style="padding:20px 32px 8px 32px;">
                  <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:1px;color:#8a8478;text-transform:uppercase;margin-bottom:10px;">შეტყობინება</div>
                  <div style="border-left:4px solid #f97316;background:#faf9f7;padding:18px 20px;border-radius:0 4px 4px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#2a2f38;line-height:1.7;">
                    ${safeMessage}
                  </div>
                </td>
              </tr>

              <!-- CTA -->
              <tr>
                <td style="padding:24px 32px 28px 32px;">
                  <a href="mailto:${from}" style="display:inline-block;background:#f97316;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;text-decoration:none;padding:12px 28px;border-radius:3px;">პასუხის გაცემა &rarr;</a>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#16181d;padding:22px 32px;">
                  <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#8a8478;line-height:1.7;">
                    GMG Arch group &mdash; Batumi, Luka Asatiani 48<br>
                    &copy; 2026 GMG Arch group. All rights reserved.
                  </div>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>`;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
