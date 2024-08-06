import { Component, inject, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
    DropdownModule
  ],
  templateUrl: './contact-us-form.component.html',
  styleUrls: ['./contact-us-form.component.scss']
})
export class ContactUsFormComponent implements OnInit {
  contactUsFirebaseFacade = inject(ContactUsFirebaseFacade);
  messageService = inject(MessageService);
  translateService = inject(TranslateService);

  subjects: { label: string, value: string }[] = [];
  selectedSubject!: string;

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe(() => {
      this.loadTranslations();
    });
  
    this.loadTranslations();
  }
  
  private loadTranslations(): void {
    this.translateService.get(['Projecting', 'Construction', 'Interior Design', 'Other']).subscribe((translations: any) => {
      this.subjects = [
        { label: translations['Projecting'], value: 'პროექტირება' },
        { label: translations['Construction'], value: 'მშენებლობა' },
        { label: translations['Interior Design'], value: 'ინტერიერის დიზაინი' },
        { label: translations['Other'], value: 'სხვა' }
      ];
    });
  }

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    from: new FormControl('', [Validators.required, Validators.email]),
    subject: new FormControl('', Validators.required),
    message: new FormControl('', Validators.required),
    number: new FormControl('', [Validators.required])
  });

  loading: boolean = false;

  submit() {
    this.loading = true;

    if (!this.form.valid) {
      this.translateService.get('Error').subscribe((errorSummary: string) => {
        if (this.form.get('name')?.hasError('required')) {
          this.translateService.get('Name is required').subscribe((res: string) => {
            this.messageService.add({ severity: 'error', summary: errorSummary, detail: res, life: 1500 });
          });
        } else if (this.form.get('from')?.hasError('required')) {
          this.translateService.get('Mail is required').subscribe((res: string) => {
            this.messageService.add({ severity: 'error', summary: errorSummary, detail: res, life: 1500 });
          });
        } else if (this.form.get('from')?.hasError('email')) {
          this.translateService.get('Incorrect mail format').subscribe((res: string) => {
            this.messageService.add({ severity: 'error', summary: errorSummary, detail: res, life: 1500 });
          });
        } else if (this.form.get('number')?.hasError('required')) {
          this.translateService.get('Number is required').subscribe((res: string) => {
            this.messageService.add({ severity: 'error', summary: errorSummary, detail: res, life: 1500 });
          })
        } else if (this.form.get('subject')?.hasError('required')) {
          this.translateService.get('Subject is required').subscribe((res: string) => {
            this.messageService.add({ severity: 'error', summary: errorSummary, detail: res, life: 1500 });
          });
        } else if (this.form.get('message')?.hasError('required')) {
          this.translateService.get('Message is required').subscribe((res: string) => {
            this.messageService.add({ severity: 'error', summary: errorSummary, detail: res, life: 1500 });
          })
        } 
      });

      this.loading = false;
      return;
    }

    const { name, from, subject, message, number } = this.form.value as { name: string, from: string, subject: string, message: string, number: string };

    const messageFormat = `
      <p><strong>სახელი:</strong> ${name}</p>
      <p><strong>ელ-ფოსტა:</strong> ${from}</p>
      <p><strong>ტელეფონის ნომერი:</strong> ${number}</p>
      <hr style="border: 0; height: 1px; background: #333; margin: 20px 0;">
      <p><strong>შეტყობინება:</strong></p>
      <p>${message}</p>`;

    const payload: ContactUsPayload = {
      to: ['kilpero84@gmail.com'],
      from,
      message: {
        subject: subject,
        html: messageFormat
      }
    };

    this.contactUsFirebaseFacade.submitContactUs(payload).subscribe({
      next: () => {
        this.translateService.get(['Success', 'Message sent successfully']).subscribe((translations: any) => {
          this.messageService.add({ severity: 'success', summary: translations['Success'], detail: translations['Message sent successfully'], life: 1500 });
        });
        this.form.reset();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      },
      error: () => {
        this.translateService.get(['Error', 'Failed to send message']).subscribe((translations: any) => {
          this.messageService.add({ severity: 'error', summary: translations['Error'], detail: translations['Failed to send message'], life: 1500 });
        });
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
