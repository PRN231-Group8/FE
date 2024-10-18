import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {
  CommonModule,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { CountryService } from './services/country.service';
import { CustomerService } from './services/customer.service';
import { EventService } from './services/event.service';
import { IconService } from './services/icon.service';
import { NodeService } from './services/node.service';
import { PhotoService } from './services/photo.service';
import { ProductService } from './services/product.service';
import { NotfoundComponent } from './core/components/notfound/notfound.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { VerifyEmailComponent } from './core/components/verify-email/verify-email.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Third-party imports
import {
  GoogleLoginProvider,
  GoogleSigninButtonModule,
  SocialAuthServiceConfig,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';
import { environment } from '../environments/environment';
import { JwtInterceptor } from './_helper/jwt.interceptor';
import { ErrorInterceptor } from './_helper/error.interceptor';
import { AuthenticationService } from './services/authentication.service';
import { fakeBackendProvider } from './_helper/fake-backend';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { LoginComponent } from './core/components/login/login.component';
import { MapApiService } from './services/map-api.service';

// Third-party imports

@NgModule({
<<<<<<< HEAD
  declarations: [AppComponent, NotfoundComponent, LoginComponent],
=======
  declarations: [AppComponent, NotfoundComponent, VerifyEmailComponent],
>>>>>>> 351a901e1a17435f848ed083cdafe2911c75c69c
  imports: [
    AppRoutingModule,
<<<<<<< HEAD
    HttpClientModule,
=======
    RouterOutlet,
    AppLayoutModule,
>>>>>>> 351a901e1a17435f848ed083cdafe2911c75c69c
    BrowserAnimationsModule,
    BrowserModule,
    MenuModule,
    ToastModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserModule,
    HttpClientModule,
    SocialLoginModule,
    GoogleSigninButtonModule,
    AppLayoutModule,
    ButtonModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    GoogleSigninButtonModule,
  ],
<<<<<<< HEAD
  exports: [
    SocialLoginModule,
    GoogleSigninButtonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
  ],
=======
  exports: [SocialLoginModule, GoogleSigninButtonModule],
>>>>>>> 351a901e1a17435f848ed083cdafe2911c75c69c
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
    MessageService,
    AuthenticationService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.GOOGLE_CLIENT_ID, {}),
          },
        ],
        onError: err => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
    fakeBackendProvider,
    CountryService,
    CustomerService,
    EventService,
    IconService,
    NodeService,
    PhotoService,
    ProductService,
<<<<<<< HEAD
    MapApiService
=======
    MenuModule,
    ToastModule,
>>>>>>> 351a901e1a17435f848ed083cdafe2911c75c69c
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
