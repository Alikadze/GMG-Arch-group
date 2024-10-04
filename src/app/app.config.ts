import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { provideFirebaseApp, initializeApp, getApp } from '@angular/fire/app';
import { ConfirmationService, MessageService } from 'primeng/api';

import { environment } from '../environments/environment.development';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import { HttpCoreInterceptor } from './core/interceptors/http-core.interceptor';

import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideStorage } from '@angular/fire/storage';
import { getStorage } from 'firebase/storage';
import { DatePipe } from '@angular/common';

import { LOCALE_ID } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import Swiper from 'swiper';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';



export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth(getApp())),
    provideStorage(() => getStorage()),
    provideFirestore(() => getFirestore()),

    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(),
    provideAnimations(),
    provideAnimationsAsync(),
    

    provideHttpClient(
      withInterceptors([
        tokenInterceptor,
        HttpCoreInterceptor
      ]), 
      withFetch()
    ),
    Swiper,

    
    MessageService,
    ConfirmationService,

    importProvidersFrom(
      HttpClientModule,

      
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient]
        }
      })
    )
  ]
};
