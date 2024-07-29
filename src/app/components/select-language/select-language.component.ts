import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-select-language',
  standalone: true,
  imports: [
    TranslateModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './select-language.component.html',
  styleUrl: './select-language.component.scss'
})
export class SelectLanguageComponent implements OnInit {
  translateService = inject(TranslateService);
  storageService = inject(StorageService);

  languages: any[] | undefined;
  formGroup!: FormGroup;

  ngOnInit(): void {
    this.languages = [
      { label: 'ქართული', value: 'ka' },
      { label: 'English', value: 'en' },
      { label: 'Русский', value: 'ru' }
    ];

    this.formGroup = new FormGroup({
      selectedLanguage: new FormControl<string>('ka')
    });

    if (typeof localStorage === 'undefined') {
      return;
    }

    const defaultLanguage = this.storageService.getItem('language') || 'ka';  
    this.translateService.setDefaultLang(defaultLanguage);
    this.translateService.use(defaultLanguage);
    this.formGroup.get('selectedLanguage')?.setValue(defaultLanguage);
  }

  changeLanguage() {
    const lang = this.formGroup.get('selectedLanguage')?.value;
    if (lang) {
      this.translateService.use(lang);
      this.storageService.setItem('language', lang);
    }
  }
}
