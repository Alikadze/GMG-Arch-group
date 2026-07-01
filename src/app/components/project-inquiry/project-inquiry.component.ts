import { Component, EventEmitter, inject, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputMaskModule } from 'primeng/inputmask';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { ContactUsFirebaseFacade } from '../../core/facades/contact-us.facade';
import { ContactUsPayload } from '../../core/interfaces/contact-us';

@Component({
  selector: 'app-project-inquiry',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    InputMaskModule,
    ButtonModule,
    TranslateModule,
  ],
  templateUrl: './project-inquiry.component.html',
  styleUrl: './project-inquiry.component.scss',
})
export class ProjectInquiryComponent implements OnDestroy {
  @Input() projectName = '';
  @Output() sent = new EventEmitter<void>();

  private facade = inject(ContactUsFirebaseFacade);
  private messageService = inject(MessageService);
  private translateService = inject(TranslateService);

  loading = false;
  destroy$ = new Subject<void>();

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    from: new FormControl('', [Validators.required, Validators.email]),
    number: new FormControl(''),
    message: new FormControl('', Validators.required),
  });

  submit() {
    if (this.form.invalid) {
      this.translateService
        .get(['Error', 'Name is required', 'Mail is required', 'Incorrect mail format', 'Message is required'])
        .pipe(
          tap((t: any) => {
            let detail = t['Message is required'];
            if (this.form.get('name')?.hasError('required')) detail = t['Name is required'];
            else if (this.form.get('from')?.hasError('required')) detail = t['Mail is required'];
            else if (this.form.get('from')?.hasError('email')) detail = t['Incorrect mail format'];
            this.messageService.add({ severity: 'error', summary: t['Error'], detail, life: 1800 });
          }),
          takeUntil(this.destroy$)
        )
        .subscribe();
      return;
    }

    this.loading = true;

    const { name, from, number, message } = this.form.value as {
      name: string;
      from: string;
      number: string;
      message: string;
    };

    const payload: ContactUsPayload = {
      to: ['kilpero84@gmail.com'],
      from,
      message: {
        subject: `Project Inquiry - ${this.projectName}`,
        html: this.buildEmailTemplate({ name, from, number, message }),
      },
    };

    this.facade
      .submitContactUs(payload)
      .pipe(
        tap(() => {
          this.translateService
            .get(['Success', 'Message sent successfully'])
            .pipe(
              tap((t: any) => {
                this.messageService.add({
                  severity: 'success',
                  summary: t['Success'],
                  detail: t['Message sent successfully'],
                  life: 1800,
                });
                this.form.reset();
                this.loading = false;
                this.sent.emit();
              }),
              takeUntil(this.destroy$)
            )
            .subscribe();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private buildEmailTemplate(data: { name: string; from: string; number: string; message: string }): string {
    const { name, from, number, message } = data;
    const safeMessage = (message || '').replace(/\n/g, '<br>');
    const phone = number || '-';

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
        <tr><td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:6px;overflow:hidden;box-shadow:0 10px 40px -12px rgba(22,24,29,0.18);">

            <tr><td style="height:6px;background:repeating-linear-gradient(-45deg,#f97316,#f97316 14px,#16181d 14px,#16181d 28px);font-size:0;line-height:0;">&nbsp;</td></tr>

            <tr><td style="background:#16181d;padding:32px 32px;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:3px;color:#f97316;text-transform:uppercase;font-weight:bold;">დაინტერესება პროექტით</div>
              <div style="font-family:'Trebuchet MS',Arial,sans-serif;font-size:30px;letter-spacing:1px;color:#ffffff;text-transform:uppercase;font-weight:bold;margin-top:6px;">GMG ARCH GROUP</div>
            </td></tr>

            <!-- Project highlight -->
            <tr><td style="padding:24px 32px 4px 32px;">
              <div style="border-left:4px solid #f97316;background:#faf9f7;padding:14px 20px;border-radius:0 4px 4px 0;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1px;color:#8a8478;text-transform:uppercase;">პროექტი</div>
                <div style="font-family:'Trebuchet MS',Arial,sans-serif;font-size:20px;color:#16181d;font-weight:bold;margin-top:2px;">${this.projectName}</div>
              </div>
            </td></tr>

            <tr><td style="padding:16px 8px 8px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eceae4;border-radius:4px;overflow:hidden;">
                ${row('სახელი', name)}
                ${row('ელ-ფოსტა', `<a href="mailto:${from}" style="color:#ea580c;text-decoration:none;">${from}</a>`)}
                ${row('ტელეფონი', phone === '-' ? phone : `<a href="tel:${phone}" style="color:#16181d;text-decoration:none;">${phone}</a>`)}
              </table>
            </td></tr>

            <tr><td style="padding:20px 32px 8px 32px;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:1px;color:#8a8478;text-transform:uppercase;margin-bottom:10px;">შეტყობინება</div>
              <div style="border-left:4px solid #16181d;background:#faf9f7;padding:18px 20px;border-radius:0 4px 4px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#2a2f38;line-height:1.7;">
                ${safeMessage}
              </div>
            </td></tr>

            <tr><td style="padding:24px 32px 28px 32px;">
              <a href="mailto:${from}" style="display:inline-block;background:#f97316;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;text-decoration:none;padding:12px 28px;border-radius:3px;">პასუხის გაცემა &rarr;</a>
            </td></tr>

            <tr><td style="background:#16181d;padding:22px 32px;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#8a8478;line-height:1.7;">
                GMG Arch group &mdash; Batumi, Luka Asatiani 48<br>
                &copy; 2026 GMG Arch group. All rights reserved.
              </div>
            </td></tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>`;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
