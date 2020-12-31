import { WarningDemoToast } from './custom-toasts/warning.demo.toast';
import { WarningDemoEndToast } from './custom-toasts/warning.demo.end.toast';
import { LicenseService } from './services/license/license.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, Injector, APP_INITIALIZER } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { APP_BASE_HREF, registerLocaleData } from '@angular/common';
import { ErrorsHandler } from './helpers/errors-handler.service';
import { ToastrModule } from 'ngx-toastr';
import { SuccessToast } from './custom-toasts/success.toast';
import { LottieAnimationViewModule } from 'ng-lottie';
import { WarningToast } from './custom-toasts/warning.toast';
import { ErrorToast } from './custom-toasts/error.toast';
import { ResetToast } from './custom-toasts/reset.toast';
import { ResetAttemptToast } from './custom-toasts/reset.attemp.toast';
import { ResetFailedToast } from './custom-toasts/reset.failed.toast';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ResetAttemptFailedToast } from './custom-toasts/reset.attemp.failed.toast';
import { AnalyticsService } from './services/analytics.service';
import localeEs from '@angular/common/locales/es';
import { RouterModule } from '@angular/router';
import { JwtInterceptor } from './helpers/jwt.interceptor';

registerLocaleData(localeEs);

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function initLicense(licenseService: LicenseService) {
  return () => licenseService.loadLicense();
}

@NgModule({
  declarations: [
    AppComponent,
    SuccessToast,
    WarningToast,
    ErrorToast,
    WarningDemoToast,
    WarningDemoEndToast,
    ResetToast,
    ResetAttemptToast,
    ResetFailedToast,
    ResetAttemptFailedToast
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatDividerModule,
    MatSliderModule,
    MatIconModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ToastrModule.forRoot({
      timeOut: 5000
    }),
    LottieAnimationViewModule.forRoot()
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/app/' },
    {
      provide: ErrorHandler,
      useClass: ErrorsHandler
    },
    AnalyticsService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: initLicense,
      deps: [LicenseService],
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    SuccessToast,
    WarningToast,
    ErrorToast,
    WarningDemoToast,
    WarningDemoEndToast,
    ResetToast,
    ResetAttemptToast,
    ResetFailedToast,
    ResetAttemptFailedToast
  ]
})
export class AppModule {
  static injector: Injector;
  constructor(injector: Injector) {
    AppModule.injector = injector;
  }
}
